/*
    Copyright (c) 2025 gematik GmbH
    Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the
    European Commission – subsequent versions of the EUPL (the "Licence").
    You may not use this work except in compliance with the Licence.
    You find a copy of the Licence in the "Licence" file or at
    https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
    Unless required by applicable law or agreed to in writing,
    software distributed under the Licence is distributed on an "AS IS" basis,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
    In case of changes by gematik find details in the "Readme" file.
    See the Licence for the specific language governing permissions and limitations under the Licence.
    *******
    For additional notes and disclaimer from gematik and in case of changes by gematik,
    find details in the "Readme" file.
 */

export const EXAMPLE_VALUE_SET = [
  {
    code: 'medFacility',
    display: 'Medizinische Einrichtung',
    designations: [
      {
        language: 'en-US',
        value: 'Medical facility',
      },
      {
        language: 'de-DE',
        value: 'Medizinische Einrichtung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
  },
  {
    code: 'hospital',
    display: 'Krankenhaus',
    designations: [
      {
        language: 'en-US',
        value: 'Hospital',
      },
      {
        language: 'de-DE',
        value: 'Krankenhaus',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'outpatSurgery',
    display: 'Einrichtung für ambulantes Operieren',
    designations: [
      {
        language: 'en-US',
        value: 'Facility for outpatient surgery',
      },
      {
        language: 'de-DE',
        value: 'Einrichtung für ambulantes Operieren',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'prevCareRehab',
    display: 'Vorsorge- oder Reha-Einrichtung',
    designations: [
      {
        language: 'en-US',
        value: 'Preventive care or rehab facility',
      },
      {
        language: 'de-DE',
        value: 'Vorsorge- oder Reha-Einrichtung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'dialysisFacility',
    display: 'Dialyseeinrichtung',
    designations: [
      {
        language: 'en-US',
        value: 'Dialysis facility',
      },
      {
        language: 'de-DE',
        value: 'Dialyseeinrichtung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'dayHospital',
    display: 'Tagesklinik',
    designations: [
      {
        language: 'en-US',
        value: 'Day hospital',
      },
      {
        language: 'de-DE',
        value: 'Tagesklinik',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'maternity',
    display: 'Entbindungseinrichtung',
    designations: [
      {
        language: 'en-US',
        value: 'Maternity',
      },
      {
        language: 'de-DE',
        value: 'Entbindungseinrichtung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'physicianOffice',
    display: 'Arztpraxis',
    designations: [
      {
        language: 'en-US',
        value: "Physician's office",
      },
      {
        language: 'de-DE',
        value: 'Arztpraxis',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'dentalSurgery',
    display: 'Zahnarztpraxis',
    designations: [
      {
        language: 'en-US',
        value: 'Dental surgery',
      },
      {
        language: 'de-DE',
        value: 'Zahnarztpraxis',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'psycFacility',
    display: 'Psychotherapeutische Praxis',
    designations: [
      {
        language: 'en-US',
        value: 'Psychotherapeutic facility',
      },
      {
        language: 'de-DE',
        value: 'Psychotherapeutische Praxis',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'othMedPractice',
    display: 'Sonstige Heilberufepraxis',
    designations: [
      {
        language: 'en-US',
        value: 'Other health professional practice',
      },
      {
        language: 'de-DE',
        value: 'Sonstige Heilberufepraxis',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'medFacPHA',
    display: 'Medizinische Einrichtung des ÖGDs',
    designations: [
      {
        language: 'en-US',
        value: 'Public health medical facility',
      },
      {
        language: 'de-DE',
        value: 'Medizinische Einrichtung des ÖGDs',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'emResServ',
    display: 'Rettungsdienst',
    designations: [
      {
        language: 'en-US',
        value: 'Emergency rescue service',
      },
      {
        language: 'de-DE',
        value: 'Rettungsdienst',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'civDisFacility',
    display: 'Einrichtungen des Zivil- und Katastrophenschutzes',
    designations: [
      {
        language: 'en-US',
        value: 'Facility for civil Protection and Disaster Assistance',
      },
      {
        language: 'de-DE',
        value: 'Einrichtungen des Zivil- und Katastrophenschutzes',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'othMedFacility',
    display: 'Sonstige medizinische Einrichtung',
    designations: [
      {
        language: 'en-US',
        value: 'Other medical facility',
      },
      {
        language: 'de-DE',
        value: 'Sonstige medizinische Einrichtung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Medizinische Einrichtung',
  },
  {
    code: 'childCareFacility',
    display: 'Gemeinschaftseinrichtung',
    designations: [
      {
        language: 'en-US',
        value: 'Child care facility',
      },
      {
        language: 'de-DE',
        value: 'Gemeinschaftseinrichtung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
  },
  {
    code: 'kindergarten',
    display: 'Kindertageseinrichtung (z. B. Kita)',
    designations: [
      {
        language: 'en-US',
        value: 'Kindergarten etc',
      },
      {
        language: 'de-DE',
        value: 'Kindertageseinrichtung (z. B. Kita)',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftseinrichtung',
  },
  {
    code: 'childDayNursery',
    display: 'Kindertagespflege',
    designations: [
      {
        language: 'en-US',
        value: 'Child day nursery',
      },
      {
        language: 'de-DE',
        value: 'Kindertagespflege',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftseinrichtung',
  },
  {
    code: 'school',
    display: 'Schule',
    designations: [
      {
        language: 'en-US',
        value: 'School',
      },
      {
        language: 'de-DE',
        value: 'Schule',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftseinrichtung',
  },
  {
    code: 'childHome',
    display: 'Kinderheim o.ä.',
    designations: [
      {
        language: 'en-US',
        value: "Children's home etc",
      },
      {
        language: 'de-DE',
        value: 'Kinderheim o.ä.',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftseinrichtung',
  },
  {
    code: 'holidayCamp',
    display: 'Ferienlager',
    designations: [
      {
        language: 'en-US',
        value: 'Holiday camp',
      },
      {
        language: 'de-DE',
        value: 'Ferienlager',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftseinrichtung',
  },
  {
    code: 'childDayCare',
    display: 'Kinderhort',
    designations: [
      {
        language: 'en-US',
        value: 'Child daycare center',
      },
      {
        language: 'de-DE',
        value: 'Kinderhort',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftseinrichtung',
  },
  {
    code: 'othEdFac',
    display: 'sonstige Ausbildungseinrichtung',
    designations: [
      {
        language: 'en-US',
        value: 'Other educational facility',
      },
      {
        language: 'de-DE',
        value: 'sonstige Ausbildungseinrichtung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftseinrichtung',
  },
  {
    code: 'othChildCareFac',
    display: 'Sonstige Kinderbetreuungseinrichtung',
    designations: [
      {
        language: 'en-US',
        value: 'Other child care facility',
      },
      {
        language: 'de-DE',
        value: 'Sonstige Kinderbetreuungseinrichtung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftseinrichtung',
  },
  {
    code: 'housingFacility',
    display: 'Gemeinschaftsunterkunft',
    designations: [
      {
        language: 'en-US',
        value: 'Housing facility',
      },
      {
        language: 'de-DE',
        value: 'Gemeinschaftsunterkunft',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
  },
  {
    code: 'nursingHome',
    display: 'voll- oder teilstationäre Einrichtung und besondere Wohnform zur Betreuung und Unterbringung',
    designations: [
      {
        language: 'en-US',
        value: 'Nursing home',
      },
      {
        language: 'de-DE',
        value: 'voll- oder teilstationäre Einrichtung und besondere Wohnform zur Betreuung und Unterbringung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftsunterkunft',
  },
  {
    code: 'elderlyCareHome',
    display: 'Einrichtung zur Betreuung/Unterbringung älterer Menschen',
    designations: [
      {
        language: 'en-US',
        value: 'Elderly care home',
      },
      {
        language: 'de-DE',
        value: 'Einrichtung zur Betreuung/Unterbringung älterer Menschen',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftsunterkunft|voll- oder teilstationäre Einrichtung und besondere Wohnform zur Betreuung und Unterbringung',
  },
  {
    code: 'disabledCareHome',
    display: 'Einrichtung zur Betreuung/Unterbringung behinderter Menschen',
    designations: [
      {
        language: 'en-US',
        value: 'Disabled care home',
      },
      {
        language: 'de-DE',
        value: 'Einrichtung zur Betreuung/Unterbringung behinderter Menschen',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftsunterkunft|voll- oder teilstationäre Einrichtung und besondere Wohnform zur Betreuung und Unterbringung',
  },
  {
    code: 'assistedCareHome',
    display: 'Einrichtung zur Betreuung/Unterbringung pflegebedürftiger Menschen',
    designations: [
      {
        language: 'en-US',
        value: 'Assisted care home',
      },
      {
        language: 'de-DE',
        value: 'Einrichtung zur Betreuung/Unterbringung pflegebedürftiger Menschen',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftsunterkunft|voll- oder teilstationäre Einrichtung und besondere Wohnform zur Betreuung und Unterbringung',
  },
  {
    code: 'homelessShelter',
    display: 'Obdachlosenunterkunft',
    designations: [
      {
        language: 'en-US',
        value: 'Homeless shelter',
      },
      {
        language: 'de-DE',
        value: 'Obdachlosenunterkunft',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftsunterkunft',
  },
  {
    code: 'migrantAccom',
    display: 'Migrantenunterkunft',
    designations: [
      {
        language: 'en-US',
        value: 'Migrant accommodation',
      },
      {
        language: 'de-DE',
        value: 'Migrantenunterkunft',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftsunterkunft',
  },
  {
    code: 'prison',
    display: 'Justizvollzugsanstalt',
    designations: [
      {
        language: 'en-US',
        value: 'Prison',
      },
      {
        language: 'de-DE',
        value: 'Justizvollzugsanstalt',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftsunterkunft',
  },
  {
    code: 'othMassAccom',
    display: 'Sonstige Massenunterkunft',
    designations: [
      {
        language: 'en-US',
        value: 'Other mass accommodation',
      },
      {
        language: 'de-DE',
        value: 'Sonstige Massenunterkunft',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftsunterkunft',
  },
  {
    code: 'outpatICServ',
    display: 'Ambulanter Intensivpflegedienst',
    designations: [
      {
        language: 'en-US',
        value: 'Outpatient intensive care service',
      },
      {
        language: 'de-DE',
        value: 'Ambulanter Intensivpflegedienst',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftsunterkunft',
  },
  {
    code: 'othOutpatCareS',
    display: 'Sonstiger ambulanter Pflegedienst',
    designations: [
      {
        language: 'en-US',
        value: 'Other outpatient care service',
      },
      {
        language: 'de-DE',
        value: 'Sonstiger ambulanter Pflegedienst',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftsunterkunft',
  },
  {
    code: 'othBloodRiskFac',
    display: 'Sonstige Einrichtung mit Blutübertragungsrisiko',
    designations: [
      {
        language: 'en-US',
        value: 'Other facility with blood-borne transmission risk',
      },
      {
        language: 'de-DE',
        value: 'Sonstige Einrichtung mit Blutübertragungsrisiko',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Gemeinschaftsunterkunft',
  },
  {
    code: 'othHygRelFacility',
    display: 'Sonstige hygienerelevante Einrichtung',
    designations: [
      {
        language: 'en-US',
        value: 'Other hygiene-relevant facility',
      },
      {
        language: 'de-DE',
        value: 'Sonstige hygienerelevante Einrichtung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
  },
  {
    code: 'othAccom',
    display: 'Andere Unterkunft',
    designations: [
      {
        language: 'en-US',
        value: 'Other accommodation',
      },
      {
        language: 'de-DE',
        value: 'Andere Unterkunft',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
  },
  {
    code: 'hotel',
    display: 'Hotel o.ä.',
    designations: [
      {
        language: 'en-US',
        value: 'Hotel etc',
      },
      {
        language: 'de-DE',
        value: 'Hotel o.ä.',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Andere Unterkunft',
  },
  {
    code: 'holidayHome',
    display: 'Ferienwohnung',
    designations: [
      {
        language: 'en-US',
        value: 'Holiday home',
      },
      {
        language: 'de-DE',
        value: 'Ferienwohnung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Andere Unterkunft',
  },
  {
    code: 'camping',
    display: 'Campingplatz o.ä.',
    designations: [
      {
        language: 'en-US',
        value: 'Camping facility etc',
      },
      {
        language: 'de-DE',
        value: 'Campingplatz o.ä.',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Andere Unterkunft',
  },
  {
    code: 'ship',
    display: 'Schiff o.ä.',
    designations: [
      {
        language: 'en-US',
        value: 'Ship etc',
      },
      {
        language: 'de-DE',
        value: 'Schiff o.ä.',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Andere Unterkunft',
  },
  {
    code: 'foodEstablmt',
    display: 'Lebensmittelbetrieb',
    designations: [
      {
        language: 'en-US',
        value: 'Food establishment',
      },
      {
        language: 'de-DE',
        value: 'Lebensmittelbetrieb',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
  },
  {
    code: 'laboratory',
    display: 'Erregerdiagnostische Untersuchungsstelle',
    designations: [
      {
        language: 'en-US',
        value: 'Laboratory',
      },
      {
        language: 'de-DE',
        value: 'Erregerdiagnostische Untersuchungsstelle',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
  },
  {
    code: 'publicHealthLab',
    display: 'Medizinaluntersuchungsamt',
    designations: [
      {
        language: 'en-US',
        value: 'Public health laboratory',
      },
      {
        language: 'de-DE',
        value: 'Medizinaluntersuchungsamt',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
  },
  {
    code: 'refLab',
    display: 'Einrichtung der Spezialdiagnostik',
    designations: [
      {
        language: 'en-US',
        value: 'Reference laboratory',
      },
      {
        language: 'de-DE',
        value: 'Einrichtung der Spezialdiagnostik',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
  },
  {
    code: 'hospitalLab',
    display: 'Krankenhauslabor',
    designations: [
      {
        language: 'en-US',
        value: 'Hospital laboratory',
      },
      {
        language: 'de-DE',
        value: 'Krankenhauslabor',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
  },
  {
    code: 'pathology',
    display: 'Pathologisch-anatomische Einrichtung',
    designations: [
      {
        language: 'en-US',
        value: 'Pathology',
      },
      {
        language: 'de-DE',
        value: 'Pathologisch-anatomische Einrichtung',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
  },
  {
    code: 'othPublicLab',
    display: 'Sonstige öffentliche Untersuchungsstelle',
    designations: [
      {
        language: 'en-US',
        value: 'Other public laboratory',
      },
      {
        language: 'de-DE',
        value: 'Sonstige öffentliche Untersuchungsstelle',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
  },
  {
    code: 'othPrivatLab',
    display: 'Sonstige private Untersuchungsstelle',
    designations: [
      {
        language: 'en-US',
        value: 'Other private laboratory',
      },
      {
        language: 'de-DE',
        value: 'Sonstige private Untersuchungsstelle',
      },
    ],
    system: 'https://demis.rki.de/fhir/CodeSystem/organizationType',
    breadcrumb: 'Erregerdiagnostische Untersuchungsstelle',
  },
];
