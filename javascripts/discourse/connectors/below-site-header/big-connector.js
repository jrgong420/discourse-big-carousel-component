export default {
  shouldRender(args, component) {
    return settings.plugin_outlet === "below-site-header";
  }
};
