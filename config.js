(function () {
  const query = new URLSearchParams(window.location.search);
  const queryApiBase = query.get("apiBase");

  window.CashCatConfig = {
    apiBase: queryApiBase || ""
  };
})();
