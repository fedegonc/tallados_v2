type WoodType = 'angelin' | 'cedro_mara';
type FontId = string;
type FinishType = 'natural' | 'barniz' | 'lacado';

type PricingConfig = {
  width: number;
  height: number;
  wood: WoodType;
  letters: number;
  font: FontId;
  iron: boolean;
  finish: FinishType;
};

type PriceSummarySection = {
  label: string;
  amount: number;
  helper?: string;
};

type PriceCalculation = {
  sections: PriceSummarySection[];
  total: number;
};

const WOOD_COST_PER_100CM2: Record<WoodType, number> = {
  angelin: 2100,
  cedro_mara: 2500,
};

const WOOD_LABEL: Record<WoodType, string> = {
  angelin: 'Angelin',
  cedro_mara: 'Cedro Mara',
};

const LETTER_COST = 650;

type FontDefinition = {
  label: string;
  multiplier: number;
  helper?: string;
  icon?: string;
};

type FontPricingMap = Record<FontId, FontDefinition>;

const DEFAULT_FONT_PRICING: FontPricingMap = {
  block: { label: 'Bloque', multiplier: 1, helper: 'Legible y recto', icon: '🔠' },
  serif: { label: 'Serif', multiplier: 1.1, helper: 'Clásica y elegante', icon: '✒️' },
  script: { label: 'Script', multiplier: 1.25, helper: 'Caligrafía artística', icon: '🖋️' },
};

const FINISH_MULTIPLIER: Record<FinishType, number> = {
  natural: 1,
  barniz: 1.18,
  lacado: 1.32,
};

const FINISH_LABEL: Record<FinishType, string> = {
  natural: 'Natural',
  barniz: 'Barniz satinado',
  lacado: 'Lacado protector',
};

const IRON_COST = 18000;
const MINIMUM_AREA_CM2 = 400;
const MIN_WIDTH_CM = 30;
const MAX_WIDTH_CM = 180;
const MIN_HEIGHT_CM = 20;
const MAX_HEIGHT_CM = 30;

const stabilize = (value: number) => (Number.isFinite(value) ? value : 0);
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const toCurrency = (value: number) => Math.max(Math.round(value), 0);

const calculatePrice = (config: PricingConfig, fontPricing: FontPricingMap = DEFAULT_FONT_PRICING): PriceCalculation => {
  const width = clamp(stabilize(config.width), MIN_WIDTH_CM, MAX_WIDTH_CM);
  const height = clamp(stabilize(config.height), MIN_HEIGHT_CM, MAX_HEIGHT_CM);
  const letters = Math.max(Math.floor(stabilize(config.letters)), 0);

  const rawArea = width * height;
  const effectiveArea = Math.max(rawArea, MINIMUM_AREA_CM2);
  const woodBase = (effectiveArea / 100) * WOOD_COST_PER_100CM2[config.wood];

  const baseLetterCost = letters * LETTER_COST;
  const fontInfo = fontPricing[config.font] ?? DEFAULT_FONT_PRICING.block;
  const typographyCost = baseLetterCost * (fontInfo?.multiplier ?? 1);

  const subtotal = woodBase + typographyCost;
  const finishFactor = FINISH_MULTIPLIER[config.finish];
  const finishCost = subtotal * (finishFactor - 1);

  const ironCost = config.iron ? IRON_COST : 0;

  const sections: PriceSummarySection[] = [
    {
      label: 'Madera',
      amount: toCurrency(woodBase),
      helper: `${WOOD_LABEL[config.wood]} · Área ${Math.round(effectiveArea)} cm²`,
    },
    {
      label: 'Tallado de letras',
      amount: toCurrency(typographyCost),
      helper: `${letters} letras · Estilo ${fontInfo?.label ?? config.font}`,
    },
  ];

  if (finishCost > 0) {
    sections.push({
      label: 'Acabado',
      amount: toCurrency(finishCost),
      helper: FINISH_LABEL[config.finish],
    });
  }

  if (ironCost > 0) {
    sections.push({
      label: 'Estructura de hierro',
      amount: ironCost,
      helper: 'Incluye soporte y colgado',
    });
  }

  const total = toCurrency(subtotal * finishFactor + ironCost);

  return { sections, total };
};

export type {
  PricingConfig,
  PriceSummarySection,
  PriceCalculation,
  WoodType,
  FontId,
  FinishType,
  FontDefinition,
  FontPricingMap,
};
export {
  calculatePrice,
  WOOD_LABEL,
  FINISH_LABEL,
  MIN_WIDTH_CM,
  MAX_WIDTH_CM,
  MIN_HEIGHT_CM,
  MAX_HEIGHT_CM,
  DEFAULT_FONT_PRICING,
};
