export const ODOO_BASE_URL = "https://attendance.bytescripterz.com";

export const ODOO_ROUTES = {
  login: `${ODOO_BASE_URL}/web/login`,
  home: `${ODOO_BASE_URL}/odoo/discuss`,
  leave: `${ODOO_BASE_URL}/odoo/time-off`,
  profile: `${ODOO_BASE_URL}/odoo/action-186`,
  attendance: `${ODOO_BASE_URL}/odoo/attendances`,
} as const;

export const AUTH_STORAGE_KEY = "userSession";
