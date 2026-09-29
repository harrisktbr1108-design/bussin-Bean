export const OPEN_MINUTES = 11 * 60;
export const CLOSE_MINUTES = 25 * 60;

export interface StoreHoursState {
  isOpen: boolean;
  label: string;
  minutesUntilChange: number;
}

export function getStoreHoursState(now = new Date(), override = false): StoreHoursState {
  if (override) return { isOpen: true, label: 'Emergency override active', minutesUntilChange: 0 };

  const minutes = now.getHours() * 60 + now.getMinutes();
  const normalized = minutes < OPEN_MINUTES ? minutes + 24 * 60 : minutes;
  const isOpen = normalized >= OPEN_MINUTES && normalized < CLOSE_MINUTES;
  const target = isOpen ? CLOSE_MINUTES : normalized < OPEN_MINUTES ? OPEN_MINUTES : OPEN_MINUTES + 24 * 60;
  const minutesUntilChange = Math.max(0, target - normalized);

  return {
    isOpen,
    label: isOpen ? 'Open until 1:00 AM' : 'Closed · Opens 11:00 AM',
    minutesUntilChange,
  };
}

export function formatCountdown(minutes: number) {
  if (minutes <= 0) return 'now';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}
