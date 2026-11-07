import {describe, expect, test} from 'vitest';
import {render} from 'vitest-browser-react';
import {MemoryRouter, Route, Routes} from 'react-router';
import {NotFoundPageComponent} from './not-found-page-component.tsx';

describe('NotFoundPageComponent', () => {
  test('links back to the patients list', async () => {
    const screen = await render(
      <MemoryRouter initialEntries={['/no-such-page']}>
        <Routes>
          <Route path="/" element={<p>Patients list</p>} />
          <Route path="*" element={<NotFoundPageComponent />} />
        </Routes>
      </MemoryRouter>
    );

    await expect
      .element(screen.getByRole('heading', {name: 'Page not found'}))
      .toBeInTheDocument();

    await screen.getByRole('link', {name: 'Go to the patients list'}).click();

    await expect.element(screen.getByText('Patients list')).toBeInTheDocument();
  });
});
