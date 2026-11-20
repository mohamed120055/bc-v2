/** Romanian text inside the RTL layout: isolated, left-to-right, tagged for screen readers. */
export default function Ro({ children, className = '', as: Tag = 'span' }) {
  return <Tag dir="ltr" lang="ro" className={className}>{children}</Tag>;
}
