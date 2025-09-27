import { useEffect, useMemo, useState } from 'react';
import InputField from './InputField';
import OptionSelector from './OptionSelector';
import PriceSummary from './PriceSummary';
import ContactButton from './ContactButton';
import {
  calculatePrice,
  FINISH_LABEL,
  WOOD_LABEL,
  MIN_WIDTH_CM,
  MAX_WIDTH_CM,
  MIN_HEIGHT_CM,
  MAX_HEIGHT_CM,
  DEFAULT_FONT_PRICING,
  type FontDefinition,
  type FontId,
  type FontPricingMap,
  type FinishType,
  type WoodType,
} from '../utils/pricing';

const woodOptions = [
  { value: 'angelin' satisfies WoodType, label: WOOD_LABEL.angelin, helper: 'Marrón rojizo, resistente', icon: '🌲' },
  { value: 'cedro_mara' satisfies WoodType, label: WOOD_LABEL.cedro_mara, helper: 'Vetado, calidad premium', icon: '🌳' },
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
  const [height, setHeight] = useState(25);
  const [wood, setWood] = useState<WoodType>('angelin');
  const [fontsMap, setFontsMap] = useState<FontPricingMap>(DEFAULT_FONT_PRICING);
  const [font, setFont] = useState<FontId>('block');
  const [finish, setFinish] = useState<FinishType>('natural');
  const [iron, setIron] = useState(false);
  const [text, setText] = useState('El Ejemplo');
  const [isLoadingFonts, setIsLoadingFonts] = useState(false);
  const [fontsError, setFontsError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const parsePayload = (payload: FontPricingMap | FontDefinition[]): FontPricingMap => {
      if (Array.isArray(payload)) {
        return payload.reduce<FontPricingMap>((acc, item) => {
          if (item && typeof item.label === 'string') {
            const id = (item as FontDefinition & { id?: string }).id ?? item.label.toLowerCase();
            acc[id] = {
              label: item.label,
              multiplier: item.multiplier ?? 1,
              helper: item.helper,
              icon: item.icon,
            } satisfies FontDefinition;
          }
          return acc;
        }, {});
      }
      return payload;
    };

    const fetchFrom = async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Estado ${response.status}`);
      }
      const payload = (await response.json()) as FontPricingMap | FontDefinition[];
      return parsePayload(payload);
    };

    const fetchFonts = async () => {
      try {
        setIsLoadingFonts(true);
        const parsed = await fetchFrom('/api/fonts');
        if (isActive) {
          setFontsMap(parsed);
          if (!parsed[font]) {
            const firstKey = Object.keys(parsed)[0];
            setFont(firstKey);
          }
          setFontsError(null);
        }
      } catch (primaryError) {
        try {
          const parsedFallback = await fetchFrom('/fonts.json');
          if (isActive) {
            setFontsMap(parsedFallback);
            if (!parsedFallback[font]) {
              const firstKey = Object.keys(parsedFallback)[0];
              setFont(firstKey);
            }
            setFontsError('Usando catálogo local de tipografías.');
          }
        } catch (secondaryError) {
          if (isActive) {
            setFontsError('No se pudieron cargar las tipografías. Usamos valores por defecto.');
            setFontsMap(DEFAULT_FONT_PRICING);
          }
        }
      } finally {
        if (isActive) {
          setIsLoadingFonts(false);
        }
      }
    };

    fetchFonts();
    return () => {
      isActive = false;
    };
  }, [font]);

  const fontOptions = useMemo(() => {
    return (Object.entries(fontsMap) as [FontId, FontDefinition][]).map(([value, info]) => ({
      value,
      label: info.label,
      helper: info.helper,
      icon: info.icon,
    }));
  }, [fontsMap]);

  const letterCount = useMemo(() => {
    return text.replace(/\s+/g, '').length;
  }, [text]);

  const calculation = useMemo(
    () =>
      calculatePrice(
        {
          width,
          height,
          wood,
          letters: letterCount,
          font,
          finish,
          iron,
        },
        fontsMap,
      ),
    [width, height, wood, letterCount, font, finish, iron, fontsMap],
  );

  const contactMessage = useMemo(() => {
    const { total } = calculation;
    const fontInfo = fontsMap[font];
    return [
      'Hola, me interesa un cartel tallado.',
      `Medidas: ${width} cm de ancho x ${height} cm de alto.`,
      `Madera: ${WOOD_LABEL[wood]}.`,
      `Texto: "${text}" (${letterCount} letras) en estilo ${fontInfo?.label ?? font}.`,
      `Acabado: ${FINISH_LABEL[finish]}.`,
      iron ? 'Agregar estructura de hierro.' : undefined,
      `Precio estimado: ${currencyFormatter.format(total)}.`,
    ]
      .filter(Boolean)
      .join(' ');
  }, [calculation, width, height, wood, text, letterCount, font, finish, iron, fontsMap]);

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
              min={MIN_WIDTH_CM}
              max={MAX_WIDTH_CM}
              step={1}
              helper={`Rango permitido: ${MIN_WIDTH_CM}-${MAX_WIDTH_CM} cm`}
              onChange={(value) => setWidth(Number(value) || MIN_WIDTH_CM)}
            />
            <InputField
              label={`Alto (${height} cm)`}
              value={height}
              type="range"
              min={MIN_HEIGHT_CM}
              max={MAX_HEIGHT_CM}
              step={1}
              helper={`Rango permitido: ${MIN_HEIGHT_CM}-${MAX_HEIGHT_CM} cm`}
              onChange={(value) => setHeight(Number(value) || MIN_HEIGHT_CM)}
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
          <OptionSelector label="Tipografía" value={font} options={fontOptions} onChange={(value) => setFont(value)} />
          <OptionSelector label="Acabado" value={finish} options={finishOptions} onChange={(value) => setFinish(value as FinishType)} />
          {fontsError && <p className="field__helper">{fontsError}</p>}
          {isLoadingFonts && <p className="field__helper">Cargando tipografías…</p>}
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
