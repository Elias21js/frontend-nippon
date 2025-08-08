export function descobrirDiaDaSemana({ dia, mes }) {
  const relaDate = new Date(2025, mes - 1, dia);

  const diasDaSemana = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];

  const data = new Date(relaDate);
  const diaDaSemana = data.getDay();

  return `${dia}/${mes} - ${diasDaSemana[diaDaSemana]}`;
}

export function getDiaDaSemana(day, { mes, ano }) {
  const dia = day.split("/")[0];

  const data = new Date(ano, parseInt(mes, 10) - 1, parseInt(dia, 10));
  const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  return `${day} - ${dias[data.getDay()]}`;
}
