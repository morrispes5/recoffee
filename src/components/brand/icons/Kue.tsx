import { IconBase, type IconProps } from './IconBase';

/** Cookie dengan gigitan dan serpihan cokelat: ikon kategori camilan. */
export function Kue(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5 3.2 3.2 0 0 1-3.2-3.2A3.2 3.2 0 0 1 12 5.6z" />
      <path
        d="M8.5 9.5h.01M10.5 14.5h.01M14.5 15.8h.01M7.5 13.6h.01M14 11.2h.01"
        strokeWidth={2.2}
      />
    </IconBase>
  );
}
