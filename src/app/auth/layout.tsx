/**
 * Root auth layout — minimal pass-through.
 * Specific layouts are handled by route groups:
 *   (customer) → carousel background for login/register
 *   (staff) → clean standalone for staff portal
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
