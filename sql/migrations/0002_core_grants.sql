-- Grants for core text tables (read-only in MVP)
grant select on table source_editions to authenticated;
grant select on table works            to authenticated;
grant select on table sections         to authenticated;
grant select on table passages         to authenticated;
grant select on table tokens           to authenticated;
