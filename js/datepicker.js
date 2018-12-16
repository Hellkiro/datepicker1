"use strict";

function datepicker(params){

var datepickerOptions = {
	year: 2019,
	monthsOff: [],
	daysOff: [],
	dateElem: '',
	datesOff: []
};

if(params.year){
	datepickerOptions.year = params.year;
}
if(params.monthsOff){datepickerOptions.monthsOff = params.monthsOff;}
if(params.daysOff){datepickerOptions.daysOff = params.daysOff;}
if(params.month){datepickerOptions.month = params.month;}
if(params.dateElem){datepickerOptions.dateElem = params.dateElem;}
if(params.datesOff){datepickerOptions.datesOff = params.datesOff;}
var monthNames = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
];
var monthNamesPadezhi = [
	'Января',
	'Февраля',
	'Марта',
	'Апреля',
	'Мая',
	'Июня',
	'Июля',
	'Августа',
	'Сентября',
	'Октября',
	'Ноября',
	'Декабря',
];
var currentMonth = 0;

for (var i = 0; i < 12; i++){
	if(datepickerOptions.monthsOff.includes(i)){
		$('.months').append('<div class="item item__disabled">'+monthNames[i]+'</div>');
		$('.dates-bottom-con').append('<div class="dates-bottom"></div>');
	} else {
		$('.months').append('<div class="item">'+monthNames[i]+'</div>');
		$('.dates-bottom-con').append('<div class="dates-bottom"></div>');
		createCalendar($('.dates-bottom:last'), datepickerOptions.year, i);
	}
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function createCalendar(id, year, month) {
	var elem = id;	
	var mon = month;
	var d = new Date(year, mon);
	var itemsCount = 0;

	var table = '';

	// заполнить первый ряд от понедельника
	// и до дня, с которого начинается месяц
	for (var i = 0; i < getDay(d); i++) {
		table += '<div class="item item__disabled item__start"></div>';
		itemsCount++;
	}	

	// ячейки календаря с датами
	while (d.getMonth() == mon) {
		
		if (datepickerOptions.datesOff[mon]){
			if (datepickerOptions.datesOff[mon].includes(d.getDate())){
				table += '<div class="item item__disabled item__closed">' + d.getDate() + '</div>';
			} else {
				if(datepickerOptions.daysOff.includes(getDay(d))){
					table += '<div class="item item__disabled">' + d.getDate() + '</div>';
				} else {
					table += '<div class="item">' + d.getDate() + '</div>';
				}
			}
		} else {
			if(datepickerOptions.daysOff.includes(getDay(d))){
				table += '<div class="item item__disabled">' + d.getDate() + '</div>';
			} else {
				table += '<div class="item">' + d.getDate() + '</div>';
			}
		}
				
		d.setDate(d.getDate() + 1);
		itemsCount++;
	}	

	// добить таблицу пустыми ячейками, если нужно
	if (itemsCount < 42) {
		for (var i = itemsCount; i < 42; i++) {
			table += '<div class="item item__disabled item__end"></div>';
		}
	}

	$(elem).html(table);
}

function getDay(date) { // получить номер дня недели, от 0(пн) до 6(вс)
  var day = date.getDay();
  if (day == 0) day = 7;
  return day - 1;
}

function setMonth(index){
	$('.new-datepicker .months .item').removeClass('item__active');
	$('.new-datepicker .months .item').eq(index).addClass('item__active');
	$('.dates-bottom').removeClass('dates-bottom__active');
	$('.dates-bottom').eq(index).addClass('dates-bottom__active');
	currentMonth = index;
}

if (!datepickerOptions.month){
	for (var i = 0; i < 12; i++){
		if(!datepickerOptions.monthsOff.includes(i)){
			datepickerOptions.month = i;
			break;
		}
	}
}
setMonth(datepickerOptions.month);

//переключение месяцев
$('.new-datepicker .months .item').click(function(){
	if (!$(this).hasClass('item__disabled')){
		setMonth($(this).index());
	}
})
//выбор даты
$('.new-datepicker .dates-bottom .item').click(function(){
	if (!$(this).hasClass('item__disabled')){
		var index = $(this).index();
		$('.new-datepicker .dates-bottom .item').removeClass('item__active');
		
		function loop(index, week, month){
			var i = index;
			switch(week) {
				case 0: i = index - 2; break;
				case 1:	i = index - 3; break;
				case 2:	i = index - 4; break;
				case 3: i = index - 5; break;
				case 4: i = index - 6; break;
				case 5:	i = index; break;
				case 6:	i = index - 1; break;
			}
			if (i < 0){
				loop3(i * -1, month - 1);
				var range = i + 5;
				while (i < range){
					if (i >= 0){
						$('.new-datepicker .dates-bottom').eq(month).find('.item').eq(i).addClass('item__active');
					}
					i++;
				}
			} else {
				var range = i + 5;
				while (i < range){
					if ($('.new-datepicker .dates-bottom').eq(month).find('.item').eq(i).hasClass('item__end')){
						loop2(0, range - i, month + 1);
						break;
					} else {
						$('.new-datepicker .dates-bottom').eq(month).find('.item').eq(i).addClass('item__active');
						i++;
					}
				}
			}
			testloop();
		}
		function loop2(i, range, month){
			while (i < range){
				if ($('.new-datepicker .dates-bottom').eq(month).find('.item').eq(i).hasClass('item__disabled')){
					i++;
					range++;
				} else {
					$('.new-datepicker .dates-bottom').eq(month).find('.item').eq(i).addClass('item__active');
					i++;
				}
			}
			testloop();
		}
		function loop3(range, month){
			var i = 42;
			var rn = i - range;
			while (i >= rn){
				if ($('.new-datepicker .dates-bottom').eq(month).find('.item').eq(i).hasClass('item__disabled')){
					i--;
					rn--;
				} else {
					$('.new-datepicker .dates-bottom').eq(month).find('.item').eq(i).addClass('item__active');
					i--;
				}
			}
			testloop();
		}
		var d = new Date(datepickerOptions.year, currentMonth, $(this).text());
		loop(index, getDay(d), currentMonth);
		
		function testloop(){
			var count = 0;
			var m = 0;
			var isFail = false;
			$('.new-datepicker .dates-bottom .item__active').each(function(i,elem){
				if ($(elem).text() == ''){
					$(elem).removeClass('item__active');
					m = $(elem).parent().index() - 1;
					isFail = true;
				} else {
					if ($(elem).parent().index() == currentMonth){
						count++;
					}
				}
			});
			if(isFail){
				loop3(5 - count, m);
			}
		}
		
		var finalDate = [];
		$('.new-datepicker .dates-bottom .item__active').each(function(i,elem){
			finalDate[i] = [];
			finalDate[i][0] = $(elem).text();
			finalDate[i][1] = $(elem).parent().index();
		});
		var isOneMouth = true;
		var arrMouth = currentMonth;
		var textForInput = '';
		finalDate.forEach(function(item, i){
			var a = item[1];
			if (a != arrMouth){
				isOneMouth = false;
			}
			textForInput += datepickerOptions.year + '-' + pad(item[1] + 1, 2) + '-' + pad(item[0], 2) + ', ';
			item[1] = monthNamesPadezhi[a];
		});
		textForInput = textForInput.slice(0, -2);
		if (isOneMouth){
			$('.'+params.dateElem).text(finalDate[0][0] + ' - ' + finalDate[4][0] + ' ' + finalDate[4][1] + ' 2019 г');
		} else {
			$('.'+params.dateElem).text(finalDate[0][0] + ' ' + finalDate[0][1] + ' - ' + finalDate[4][0] + ' ' + finalDate[4][1] + ' 2019 г');
		}
		$('.input-date').val(textForInput);
	}
});
}