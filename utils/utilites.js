
export function formatCurrency(amount, currency = "MXN", locale = "es-MX") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function arrayMove(arr, from, to) {
  if (from === to) return arr;

  const newArr = [...arr];
  const [moved] = newArr.splice(from, 1);

  newArr.splice(to, 0, moved);

  return newArr;
}

export function getTenantFromRequest(req) {

  const host = req.headers.host;
  const tenant = host?.split('.')[0] || 'default';

  return tenant;
}