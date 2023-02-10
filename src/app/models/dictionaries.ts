const estadoCivilDic = {
  C: 'Casado(a)',
  D: 'Divorciado(a)',
  E: 'Empresarial',
  N: 'No Definido',
  S: 'Soltero(a)',
  U: 'Union Libre',
  V: 'Viudo(a)',
};

const nivelEduDic = {
  '0': 'ninguna',
  '1': 'Primaria',
  '2': 'Secundaria',
  '3': 'Técnica',
  '4': 'Superior',
  '5': 'Posgrado',
  '6': 'Uso Futuro',
  '7': 'Universit. Imcomp',
  '8': 'Universitario',
};

const sexoDic = {
  F: 'FEMENINO',
  M: 'MASCULINO',
};

const tipoViviendaDic = {
  P: 'PROPIA',
  A: 'ARRENDADA',
  F: 'VIVE CON FAMILIARES',
};

const tiempoResidenciaDic = {
  '0': 'No registra',
  '1': 'Menos de 6 meses',
  '2': 'de 6 a 12 meses',
  '3': 'de 1 a 2 años',
  '4': 'de 2 a 3 años',
  '5': 'mas de 4 años',
};

const tipoFamiliaDic = {
  '01': 'ABUELO(A)',
  '02': 'CONVIVIENTE',
  '03': 'ESPOSO(A)',
  '04': 'CUÑADO(A)',
  '05': 'HERMANO(A)',
  '06': 'HIJO(A)',
  '07': 'MADRE',
  '08': 'PADRE',
  '09': 'PRIMO(A)',
  '10': 'SOBRINO(A)',
  '11': 'SUEGRO(A)',
  '12': 'TIO(A)',
  '13': 'YERNO/NUERA',
};

const referenciaDic = {
  '01': 'AMIGO(A)',
  '02': 'ARRENDADOR(A)',
  '03': 'JEFE(A)',
  '04': 'COMPAÑERO(A) DE TRABAJO',
  '05': 'VECINO(A)',
};

const tipoEmpleoDic = {
  DEP: 'DEPENDIENTE',
  IND: 'INDEPENDIENTE',
  CES: 'CESANTE',
  INF: 'INFORMAL',
};

export const estadoCivilPairs = Object.entries(estadoCivilDic).map(
  ([value, text]) => ({ value, text })
);
export const nivelEduPairs = Object.entries(nivelEduDic).map(
  ([value, text]) => ({ value, text })
);
export const sexoPairs = Object.entries(sexoDic).map(([value, text]) => ({
  value,
  text,
}));
export const tipoViviendaPairs = Object.entries(tipoViviendaDic).map(
  ([value, text]) => ({ value, text })
);
export const tiempoResidenciaPairs = Object.entries(tiempoResidenciaDic).map(
  ([value, text]) => ({ value, text })
);
export const tipoFamiliaPairs = Object.entries(tipoFamiliaDic).map(
  ([value, text]) => ({ value, text })
);
export const referenciaPairs = Object.entries(referenciaDic).map(
  ([value, text]) => ({ value, text })
);
export const tipoEmpleoPairs = Object.entries(tipoEmpleoDic).map(
  ([value, text]) => ({ value, text })
);
