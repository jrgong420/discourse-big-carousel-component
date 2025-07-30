export default {
  shouldRender(args, component) {
    return settings.plugin_outlet === "above-main-container";
  }
};
