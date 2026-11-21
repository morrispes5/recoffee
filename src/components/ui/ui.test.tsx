import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { Switch } from './Switch';
import { TextField } from './TextField';

describe('Button', () => {
  it('nonaktif dan tidak bisa diklik saat loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Kirim pesanan
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Kirim pesanan' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Switch', () => {
  function Demo() {
    const [on, setOn] = useState(true);
    return (
      <Switch
        label="Kopi Tubruk"
        checked={on}
        onChange={setOn}
        stateText={{ on: 'Tersedia', off: 'Habis' }}
      />
    );
  }

  it('berganti status dan menampilkan teks, bukan hanya warna', async () => {
    render(<Demo />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(sw).toHaveTextContent('Tersedia');
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(sw).toHaveTextContent('Habis');
  });
});

describe('TextField', () => {
  it('menghubungkan label dan pesan error', () => {
    render(<TextField label="Nomor HP" error="Nomor HP belum benar." />);
    const input = screen.getByLabelText('Nomor HP');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Nomor HP belum benar.');
  });
});
