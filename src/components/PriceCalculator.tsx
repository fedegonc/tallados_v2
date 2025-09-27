import { useMemo, useState } from 'react';
import InputField from './InputField';
import OptionSelector from './OptionSelector';
import PriceSummary from './PriceSummary';
import ContactButton from './ContactButton';
import {
  calculatePrice,
  FINISH_LABEL,
  FONT_LABEL,
  WOOD_LABEL,
  type FinishType,
  type FontStyle,
  type WoodType,
} from '../utils/pricing';

const woodOptions = (Object.entries(WOOD_LABEL) as [WoodType, string][]).map(([value, label]) => ({
  value,
  label,
}));

const fontOptions = (Object.entries(FONT_LABEL) as [FontStyle, string][]).map(([value, label]) => ({
  value,
  label,
}));

const finishOptions = (Object.entries(FINISH_LABEL) as [FinishType, string][]).map(([value, label]) => ({
  value,
  label,
}));

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

const PriceCalculator = () => {
  const [width, setWidth] = useState(60);
  const [height, setHeight] = useState(40);
  const [wood, setWood] = useState<WoodType>('pino');
  const [letters, setLetters] = useState(10);
  const [font, setFont] = useState<FontStyle>('block');
  const [finish, setFinish] = useState<FinishType>('natural');
  const [iron, setIron] = useState(false);

  const calculation = useMemo(
    () =>
      calculatePrice({
        width,
        height,
        wood,
        letters,
        font,
        finish,
        iron,
      }),
    [width, height, wood, letters, font, finish, iron],
  );

  const contactMessage = useMemo(() => {
    const { total } = calculation;
    return [
      'Hola, me interesa un cartel tallado.',
      `Medidas: ${width} cm de ancho x ${height} cm de alto.`,
      `Madera: ${WOOD_LABEL[wood]}.`,
      `Letras: ${letters} en estilo ${FONT_LABEL[font]}.`,
      `Acabado: ${FINISH_LABEL[finish]}.`,
      iron ? 'Agregar estructura de hierro.' : undefined,
      `Precio estimado: ${currencyFormatter.format(total)}.`,
    ]
      .filter(Boolean)
      .join(' ');
  }, [calculation, width, height, wood, letters, font, finish, iron]);

  return (
    <main className="calculator">
      <header className="calculator__header">
        <h1>Calculadora de tallados</h1>
        <p>Estimá el precio de tu cartel en simples pasos.</p>
      </header>

      <section className="calculator__section">
        <h2>Dimensiones</h2>
        <div className="calculator__grid">
          <InputField
            label="Ancho (cm)"
            value={width}
            min={10}
            step={1}
            onChange={(value) => setWidth(Number(value) || 0)}
          />
          <InputField
            label="Alto (cm)"
            value={height}
            min={10}
            step={1}
            onChange={(value) => setHeight(Number(value) || 0)}
          />
          <InputField
            label="Cantidad de letras"
            value={letters}
            min={1}
            step={1}
            onChange={(value) => setLetters(Math.max(Number(value) || 0, 0))}
          />
        </div>
      </section>

      <section className="calculator__section">
        <h2>Materiales y estilo</h2>
        <OptionSelector label="Madera" value={wood} options={woodOptions} onChange={(value) => setWood(value as WoodType)} />
        <OptionSelector label="Tipografía" value={font} options={fontOptions} onChange={(value) => setFont(value as FontStyle)} />
        <OptionSelector label="Acabado" value={finish} options={finishOptions} onChange={(value) => setFinish(value as FinishType)} />
        <label className="calculator__checkbox">
          <input type="checkbox" checked={iron} onChange={(event) => setIron(event.target.checked)} />
          <span>Agregar estructura de hierro</span>
        </label>
      </section>

      <PriceSummary sections={calculation.sections} total={calculation.total} />

      <footer className="calculator__footer">
        <ContactButton message={contactMessage} />
      </footer>
    </main>
  );
};

export default PriceCalculator;
