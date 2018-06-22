export function GetNISFormat(amount){
	return new Intl.NumberFormat('he-IL', {
	  style: 'currency',
	  currency: 'ILS'
	}).format(amount);
}