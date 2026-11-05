create function apply_payment_event(p_event_id text,p_payload jsonb) returns void language plpgsql security definer set search_path=public as $$declare payment jsonb; p payments; o orders; kind text;begin
 kind=p_payload->>'event';payment=p_payload#>'{payload,payment,entity}';
 if kind not in ('payment.captured','payment.failed','refund.processed') then return;end if;
 if kind='refund.processed' then select * into p from payments where provider_payment_id=p_payload#>>'{payload,refund,entity,payment_id}' for update;else select * into p from payments where provider_order_id=payment->>'order_id' for update;end if;
 if not found then raise exception 'Unknown payment, retry after reconciliation';end if;
 insert into payment_events(provider_event_id,payload) values(p_event_id,p_payload) on conflict(provider_event_id) do nothing;if not found then return;end if;
 select * into o from orders where id=p.order_id for update;
 if kind='payment.captured' then
 if (payment->>'amount')::int<>o.total_minor or payment->>'currency'<>'INR' or payment->>'status'<>'captured' then raise exception 'Payment amount or currency mismatch';end if;
 if o.payment_status<>'refunded' then update orders set payment_status='paid',version=version+1 where id=o.id;update payments set status='paid',provider_payment_id=payment->>'id' where id=p.id;end if;
 elsif kind='payment.failed' and o.payment_status='pending' then update orders set payment_status='failed',version=version+1 where id=o.id;update payments set status='failed' where id=p.id;
 elsif kind='refund.processed' then if (p_payload#>>'{payload,refund,entity,amount}')::int=o.total_minor then update orders set payment_status='refunded',version=version+1 where id=o.id;update payments set status='refunded' where id=p.id;end if;end if;
 insert into audit_logs(action,entity_id) values('Verified gateway event: '||kind,o.id);end$$;
revoke all on function apply_payment_event(text,jsonb) from public,anon,authenticated;
grant execute on function apply_payment_event(text,jsonb) to service_role;
