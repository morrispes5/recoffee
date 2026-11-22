import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { closeAlert, showAlert, useActiveAlert } from './alertStore';

function Probe() {
  const alert = useActiveAlert();
  return <output data-testid="alert">{alert ? `${alert.tone}|${alert.title}` : 'kosong'}</output>;
}

afterEach(() => {
  cleanup();
  act(() => closeAlert());
});

describe('alertStore', () => {
  it('menampilkan alert lalu menutupnya', () => {
    render(<Probe />);
    expect(screen.getByTestId('alert')).toHaveTextContent('kosong');

    act(() => showAlert({ tone: 'error', title: 'Meja 50 tidak ada' }));
    expect(screen.getByTestId('alert')).toHaveTextContent('error|Meja 50 tidak ada');

    act(() => closeAlert());
    expect(screen.getByTestId('alert')).toHaveTextContent('kosong');
  });

  it('alert baru menggantikan yang lama', () => {
    render(<Probe />);
    act(() => showAlert({ tone: 'warning', title: 'Pertama' }));
    act(() => showAlert({ tone: 'success', title: 'Kedua' }));
    expect(screen.getByTestId('alert')).toHaveTextContent('success|Kedua');
  });
});
