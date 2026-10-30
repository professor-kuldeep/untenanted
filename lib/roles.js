export const ROLE_LABELS={
  super_admin:'Super Admin',admin:'Admin',editor:'Editor',seo_manager:'SEO Manager',moderator:'Moderator',author:'Author',member:'Member'
};
export const ROLE_LEVEL={member:0,author:10,moderator:20,seo_manager:25,editor:30,admin:40,super_admin:50};
export const PERMISSIONS={
  dashboard:['super_admin','admin','editor','seo_manager','moderator','author'],
  posts:['super_admin','admin','editor','author'],
  publish:['super_admin','admin','editor'],
  schedule:['super_admin','admin','editor'],
  delete:['super_admin','admin'],
  trash:['super_admin','admin'],
  seo:['super_admin','admin','editor','seo_manager'],
  redirects:['super_admin','admin','editor','seo_manager'],
  taxonomies:['super_admin','admin','editor','seo_manager'],
  letters:['super_admin','admin','editor'],
  pages:['super_admin','admin','editor'],
  custom_pages:['super_admin','admin','editor'],
  homepage:['super_admin','admin','editor'],
  site_design:['super_admin','admin','editor'],
  media:['super_admin','admin','editor','author'],
  moderate:['super_admin','admin','editor','moderator'],
  analytics:['super_admin','admin','editor','seo_manager'],
  traffic_search:['super_admin','admin','editor','seo_manager'],
  security:['super_admin','admin','editor','seo_manager','moderator','author'],
  backup:['super_admin','admin'],
  health:['super_admin','admin'],
  newsletter:['super_admin','admin','editor'],
  workflow:['super_admin','admin','editor','author'],
  collections:['super_admin','admin','editor'],
  daily:['super_admin','admin','editor'],
  revisions:['super_admin','admin','editor'],
  audit:['super_admin','admin'],
  users:['super_admin']
};
export function can(role,action){return (PERMISSIONS[action]||[]).includes(role)}
