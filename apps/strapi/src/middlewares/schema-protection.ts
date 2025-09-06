import type { Core } from '@strapi/strapi';

const RESTRICTED_ENDPOINTS_FOR_EDITORS = [
  // Content Type Builder - Schema modification
  '/content-type-builder',
  '/ctb-utils',
  
  // Admin settings and configuration
  '/admin/users',
  '/admin/roles',
  '/admin/permissions', 
  '/admin/api-tokens',
  '/admin/transfer-tokens',
  '/admin/webhooks',
  '/admin/marketplace',
  '/admin/plugins',
  '/admin/settings',
  
  // System configuration
  '/admin/application-infos',
  '/admin/license-limit-information',
  '/admin/project-settings',
  '/admin/project-type',
  '/admin/telemetry-properties',
  
  // Plugin management
  '/admin/plugins/install',
  '/admin/plugins/uninstall',
  
  // I18n admin settings
  '/i18n/locales',
  '/i18n/iso-locales',
  
  // Upload plugin settings
  '/upload/settings',
  '/upload/configuration',
  
  // Users & Permissions plugin admin
  '/users-permissions/roles',
  '/users-permissions/providers',
  '/users-permissions/email-templates',
  '/users-permissions/advanced-settings',
];

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: any) => {
    // Skip for non-admin requests
    if (!ctx.request.path.startsWith('/admin/')) {
      return next();
    }

    const user = ctx.state.user;
    
    // Allow super admin access to everything
    if (!user || user.role?.code === 'strapi-super-admin') {
      return next();
    }

    // Check if user is Editor and trying to access restricted endpoint
    if (user.role?.code === 'strapi-editor') {
      const isRestrictedEndpoint = RESTRICTED_ENDPOINTS_FOR_EDITORS.some(endpoint =>
        ctx.request.path.includes(endpoint)
      );

      if (isRestrictedEndpoint) {
        strapi.log.warn('Schema Protection: Editor access blocked', {
          userId: user.id,
          userEmail: user.email,
          role: user.role.code,
          attemptedPath: ctx.request.path,
          method: ctx.request.method,
          ip: ctx.request.ip,
          timestamp: new Date().toISOString(),
        });

        ctx.status = 403;
        ctx.body = {
          error: 'Forbidden',
          message: 'Editors do not have permission to access system settings and schema modifications.',
          details: {
            allowedActions: [
              'Manage Pages content',
              'Manage Posts content', 
              'Upload and manage Media files',
              'Publish and unpublish content',
            ],
            restrictedActions: [
              'Modify content schemas',
              'Manage users and roles',
              'Access system settings',
              'Install or configure plugins',
              'Modify API tokens or webhooks',
            ],
          },
        };
        return;
      }
    }

    // Allow access for other roles or non-restricted endpoints
    await next();
  };
};