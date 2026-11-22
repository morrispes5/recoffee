import { CheckCircle, Info, Warning, XCircle } from '@phosphor-icons/react';
import { Toaster } from 'sonner';

/** Toast bergaya RE:coffee: kartu putih bergaris, garis kiri berwarna sesuai jenis. */
export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      visibleToasts={3}
      gap={10}
      offset={{ top: 16, left: 16, right: 16 }}
      mobileOffset={{ top: 12, left: 12, right: 12 }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-full items-start gap-3 rounded-ui border border-l-4 border-garis bg-putih p-4 text-tubruk sm:w-[23rem]',
          icon: 'mt-0.5 shrink-0',
          content: 'min-w-0 flex-1',
          title: 'text-body-s font-semibold text-tubruk',
          description: 'mt-0.5 text-body-s text-ampas',
          success: 'border-l-blirik',
          error: 'border-l-kaleng',
          warning: 'border-l-lampu',
          info: 'border-l-ampas',
        },
      }}
      icons={{
        success: <CheckCircle size={22} weight="fill" className="text-blirik" aria-hidden="true" />,
        error: <XCircle size={22} weight="fill" className="text-kaleng" aria-hidden="true" />,
        warning: <Warning size={22} weight="fill" className="text-lampu" aria-hidden="true" />,
        info: <Info size={22} weight="fill" className="text-ampas" aria-hidden="true" />,
      }}
    />
  );
}
