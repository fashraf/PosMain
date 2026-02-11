
INSERT INTO user_roles (user_id, role_id)
VALUES (
  '222d0e7a-8f79-4b75-a858-676b59886c25',
  'ce3de3f2-aa33-480f-81f3-634583cdb3f0'
)
ON CONFLICT ON CONSTRAINT user_roles_user_role_unique DO NOTHING;
