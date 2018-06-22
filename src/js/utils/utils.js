export function GetNISFormat(amount){
	return new Intl.NumberFormat('en', {
	  style: 'currency',
	  currency: 'ILS'
	}).format(amount);
}