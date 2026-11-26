const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeZone: "America/Mexico_City",
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Mexico_City",
});

export const formatDate = (iso: string | Date) => dateFormatter.format(new Date(iso));
export const formatDateTime = (iso: string | Date) => dateTimeFormatter.format(new Date(iso));
