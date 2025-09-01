
export function formatCurrency(amount, currency = "MXN", locale = "es-MX") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getLocalDateString(date = new Date()) {

  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day   = String(date.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;

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