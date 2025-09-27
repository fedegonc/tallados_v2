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

const woodOptions = [
  { value: 'pino' satisfies WoodType, label: WOOD_LABEL.pino, helper: 'Ligero y económico', icon: '🌲' },
  { value: 'cedro' satisfies WoodType, label: WOOD_LABEL.cedro, helper: 'Tono rojizo, resistente', icon: '🌳' },
  { value: 'roble' satisfies WoodType, label: WOOD_LABEL.roble, helper: 'Premium y duradero', icon: '🪵' },
];

const fontOptions = [
  { value: 'block' satisfies FontStyle, label: FONT_LABEL.block, helper: 'Legible y recto', icon: '🔠' },
  { value: 'serif' satisfies FontStyle, label: FONT_LABEL.serif, helper: 'Clásica y elegante', icon: '✒️' },
  { value: 'script' satisfies FontStyle, label: FONT_LABEL.script, helper: 'Caligrafía artística', icon: '🖋️' },
];

const finishOptions = [
  { value: 'natural' satisfies FinishType, label: FINISH_LABEL.natural, helper: 'Sellado básico', icon: '🌞' },
  { value: 'barniz' satisfies FinishType, label: FINISH_LABEL.barniz, helper: 'Brillo satinado', icon: '🎨' },
  { value: 'lacado' satisfies FinishType, label: FINISH_LABEL.lacado, helper: 'Mayor protección', icon: '🛡️' },
];

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

const PriceCalculator = () => {
  const [width, setWidth] = useState(60);
  const [height, setHeight] = useState(40);
  const [wood, setWood] = useState<WoodType>('pino');
  const [font, setFont] = useState<FontStyle>('block');
  const [finish, setFinish] = useState<FinishType>('natural');
  const [iron, setIron] = useState(false);
  const [text, setText] = useState('Bienvenidos');

  const letterCount = useMemo(() => {
    return text.replace(/\s+/g, '').length;
  }, [text]);

  const calculation = useMemo(
    () =>
      calculatePrice({
        width,
        height,
        wood,
        letters: letterCount,
        font,
        finish,
        iron,
      }),
    [width, height, wood, letterCount, font, finish, iron],
  );

  const contactMessage = useMemo(() => {
    const { total } = calculation;
    return [
      'Hola, me interesa un cartel tallado.',
      `Medidas: ${width} cm de ancho x ${height} cm de alto.`,
      `Madera: ${WOOD_LABEL[wood]}.`,
      `Texto: "${text}" (${letterCount} letras) en estilo ${FONT_LABEL[font]}.`,
      `Acabado: ${FINISH_LABEL[finish]}.`,
      iron ? 'Agregar estructura de hierro.' : undefined,
      `Precio estimado: ${currencyFormatter.format(total)}.`,
    ]
      .filter(Boolean)
      .join(' ');
  }, [calculation, width, height, wood, text, letterCount, font, finish, iron]);

  return (
    <main className="calculator">
      <header className="calculator__header">
        <h1>Calculadora de tallados</h1>
        <p>Estimá el precio de tu cartel en simples pasos.</p>
      </header>

      <section className="step-card">
        <h2 className="step-card__title">
          <span className="step-card__index">1</span> Dimensiones y texto
        </h2>
        <div className="step-card__body">
          <div className="step-card__sliders">
            <InputField
              label={`Ancho (${width} cm)`}
              value={width}
              type="range"
              min={30}
              max={200}
              step={1}
              helper="Ajustá el ancho con el deslizador"
              onChange={(value) => setWidth(Number(value) || 0)}
            />
            <InputField
              label={`Alto (${height} cm)`}
              value={height}
              type="range"
              min={20}
              max={120}
              step={1}
              helper="Ajustá el alto con el deslizador"
              onChange={(value) => setHeight(Number(value) || 0)}
            />
          </div>
          <InputField
            label="Texto a tallar"
            value={text}
            type="text"
            multiline
            rows={2}
            maxLength={60}
            placeholder="Ej. Bienvenidos a casa"
            helper={`Contamos ${letterCount} letras (sin espacios)`}
            onChange={(value) => setText(String(value))}
          />
        </div>
      </section>

      <section className="step-card">
        <h2 className="step-card__title">
          <span className="step-card__index">2</span> Estilo del cartel
        </h2>
        <div className="step-card__body">
          <OptionSelector label="Madera" value={wood} options={woodOptions} onChange={(value) => setWood(value as WoodType)} />
          <OptionSelector label="Tipografía" value={font} options={fontOptions} onChange={(value) => setFont(value as FontStyle)} />
          <OptionSelector label="Acabado" value={finish} options={finishOptions} onChange={(value) => setFinish(value as FinishType)} />
        </div>
      </section>

      <section className="step-card">
        <h2 className="step-card__title">
          <span className="step-card__index">3</span> Extras y resultado
        </h2>
        <div className="step-card__body">
          <label className="calculator__checkbox">
            <input type="checkbox" checked={iron} onChange={(event) => setIron(event.target.checked)} />
            <span>Agregar estructura de hierro</span>
          </label>

          <PriceSummary sections={calculation.sections} total={calculation.total} />

          <p className="calculator__disclaimer">Este es un precio estimado. El valor final puede variar según ajustes y diseño.</p>

          <footer className="calculator__footer">
            <ContactButton message={contactMessage} />
          </footer>
        </div>
      </section>
    </main>
  );
};

export default PriceCalculator;
