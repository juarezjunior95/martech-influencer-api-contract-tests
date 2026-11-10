import { GeoRules } from '../types';

export const GROWTH_LEVERS_RULES: Record<string, GeoRules> = {
  'Lead Premium': {
    global: {
      // Lead Premium + Global + All Brands: available only via Global Brands
      'All Brands': {},
      'Beer Price Segment': { allowed: ['Super Premium', 'Premium', 'Core+'] },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { noAllOption: true, defaultFirstAlphabetical: true },
    },
    zone: {
      'All Brands': { locked: true },
      'Beer Price Segment': { allowed: ['Super Premium', 'Premium', 'Core+'] },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { notAvailable: true },
    },
    eur: {
      'All Brands': {},
      'Beer Price Segment': { allowed: ['Super Premium', 'Premium', 'Core+'] },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { notAvailable: true },
    },
    country: {
      // Lead Premium + Country: everything available
      'All Brands': {},
      'Beer Price Segment': {
        allowed: ['Super Premium', 'Premium', 'Core+'],
        brandLocked: true, // Brand locked when BPS = All
      },
      Portfolio: {
        allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'],
        brandLocked: true, // Brand locked when Portfolio = All
      },
      'Global Brands': { noAllOption: true, defaultFirstAlphabetical: true },
    },
  },
  'Superior Core': {
    global: {
      'All Brands': { locked: true },
      'Beer Price Segment': { allowed: ['Core', 'Value'] },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { notAvailable: true },
    },
    zone: {
      'All Brands': { locked: true },
      'Beer Price Segment': { allowed: ['Core', 'Value'] },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { notAvailable: true },
    },
    eur: {
      'All Brands': { locked: true },
      'Beer Price Segment': { allowed: ['Core', 'Value'] },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { notAvailable: true },
    },
    country: {
      'All Brands': {},
      'Beer Price Segment': {
        allowed: ['Core', 'Value'],
        brandLocked: true,
      },
      Portfolio: {
        allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'],
        brandLocked: true,
      },
      'Global Brands': { notAvailable: true },
    },
  },
  'Balanced Choices': {
    global: {
      'All Brands': { locked: true },
      'Beer Price Segment': {
        allowed: ['Super Premium', 'Premium', 'Core+', 'Core', 'Value'],
      },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { notAvailable: true },
    },
    zone: {
      'All Brands': { locked: true },
      'Beer Price Segment': {
        allowed: ['Super Premium', 'Premium', 'Core+', 'Value'],
      },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { notAvailable: true },
    },
    eur: {
      'All Brands': { locked: true },
      'Beer Price Segment': {
        allowed: ['Super Premium', 'Premium', 'Core+', 'Value'],
      },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { notAvailable: true },
    },
    country: {
      'All Brands': {},
      'Beer Price Segment': {
        allowed: ['Super Premium', 'Premium', 'Core+', 'Value'],
        brandLocked: true,
      },
      Portfolio: {
        allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'],
        brandLocked: true,
      },
      'Global Brands': { notAvailable: true },
    },
  },
  'Beyond Beer': {
    global: {
      'All Brands': { locked: true },
      'Beer Price Segment': { notAvailable: true },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { notAvailable: true },
    },
    zone: {
      'All Brands': { locked: true },
      'Beer Price Segment': { notAvailable: true },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { notAvailable: true },
    },
    eur: {
      'All Brands': { locked: true },
      'Beer Price Segment': { notAvailable: true },
      Portfolio: { allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'] },
      'Global Brands': { notAvailable: true },
    },
    country: {
      'All Brands': {},
      'Beer Price Segment': { notAvailable: true },
      Portfolio: {
        allowed: ['Megabrands', 'Expansion', 'Sustain', 'Tail'],
        brandLocked: true,
      },
      'Global Brands': { notAvailable: true },
    },
  },
};
