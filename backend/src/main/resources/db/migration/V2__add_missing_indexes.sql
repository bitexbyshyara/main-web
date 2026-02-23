CREATE INDEX idx_support_tickets_tenant ON support_tickets(tenant_id);
CREATE INDEX idx_support_tickets_created ON support_tickets(tenant_id, created_at DESC);
CREATE INDEX idx_invoices_created ON invoices(tenant_id, created_at DESC);
