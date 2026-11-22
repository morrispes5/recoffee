import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useParams } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { closeAlert, useActiveAlert } from '../../lib/alertStore';
import { MasukMejaForm, PESAN_NOMOR_MEJA } from './MasukMejaForm';

function HalamanMeja() {
  return <p>Menu meja {useParams().nomor}</p>;
}

function ProbeAlert() {
  const alert = useActiveAlert();
  return <output data-testid="alert">{alert ? `${alert.tone}|${alert.title}` : ''}</output>;
}

function renderForm() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<MasukMejaForm />} />
        <Route path="/meja/:nomor" element={<HalamanMeja />} />
      </Routes>
      <ProbeAlert />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  closeAlert();
});

describe('MasukMejaForm', () => {
  it('membawa pelanggan ke menu meja yang diketik', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText('Nomor meja'), '5');
    await userEvent.click(screen.getByRole('button', { name: /mulai pesan/i }));
    expect(await screen.findByText('Menu meja 5')).toBeInTheDocument();
  });

  it.each(['0', '29', ''])('menolak nomor "%s" dengan pesan yang jelas', async (nomor) => {
    renderForm();
    if (nomor) await userEvent.type(screen.getByLabelText('Nomor meja'), nomor);
    await userEvent.click(screen.getByRole('button', { name: /mulai pesan/i }));
    expect(screen.getByText(PESAN_NOMOR_MEJA)).toBeInTheDocument();
    expect(screen.queryByText(/Menu meja/)).not.toBeInTheDocument();
  });

  it('menampilkan alert modal saat nomor meja tidak ada', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText('Nomor meja'), '50');
    await userEvent.click(screen.getByRole('button', { name: /mulai pesan/i }));
    expect(screen.getByTestId('alert')).toHaveTextContent('error|Meja 50 tidak ada');
  });

  it('mengingatkan lewat alert bila nomor meja kosong', async () => {
    renderForm();
    await userEvent.click(screen.getByRole('button', { name: /mulai pesan/i }));
    expect(screen.getByTestId('alert')).toHaveTextContent('warning|Nomor meja belum diisi');
  });

  it('tidak menampilkan alert untuk nomor yang valid', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText('Nomor meja'), '7');
    await userEvent.click(screen.getByRole('button', { name: /mulai pesan/i }));
    expect(await screen.findByText('Menu meja 7')).toBeInTheDocument();
    expect(screen.getByTestId('alert')).toBeEmptyDOMElement();
  });

  it('hanya menerima angka', async () => {
    renderForm();
    const input = screen.getByLabelText('Nomor meja');
    await userEvent.type(input, 'a1b2');
    expect(input).toHaveValue('12');
  });
});
