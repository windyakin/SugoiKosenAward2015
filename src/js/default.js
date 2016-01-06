(function($, Chart, window, undefined) {

	'use strict';

	// jQuery load check
	if (typeof jQuery === undefined) {
		throw new Error('This JavaScript requires jQuery');
	}

	function formatNum(point) {
		var str = point.toString();
		if (point % 1 !== 0.5) {
			str = point.toString() + '.0';
		}
		return str;
	}

	$(document).ready(function() {

		$.ajax({
			url: 'http://jsoon.digitiminimi.com/twitter/count.json',
			type: 'get',
			data: {
				url: 'http://sugoi.windyakin.net',
				callback: 'count'
			},
			jsonpCallback: 'count',
			dataType: 'jsonp',
		}).done(function(data) {
			var count = data.count;
			$('.twitter-share-list').text(count);
		});

		$(window).scroll(function() {
			var visible = $('.return-pagetop-button').is(':visible');
			if ($(this).scrollTop() >= 300 && !visible) {
				$('.return-pagetop-button').fadeIn();
			}
			else if ($(this).scrollTop() < 300 && visible) {
				$('.return-pagetop-button').fadeOut();
			}
		});

		$('a[href^="#"]').click(function() {
			// Bootstrap関連っぽそうだったら
			if (! $.isEmptyObject($(this).data())) {
				return; // 何もしない
			}
			// 値取得
			var href = $(this).attr('href');
			// hrefが空だったら
			if (href === '' || href === '#') {
				return; // 終わり
			}
			var $target = $(href);
			var position = $target.offset().top;
			$('body,html').animate({scrollTop:position}, 500, 'swing');
			return false;
		});
		Chart.defaults.global.responsive = true;
		Chart.defaults.global.animation = false;
		var kosenData = {
			ube: [5, 4.5, 5, 4.5, 5],
			nagaoka: [4.5, 4.5, 5, 3, 5],
			kanazawa: [4.5, 4, 4.5, 4, 3.5],
			kisarazu: [4, 3.5, 5, 4.5, 3.5],
			kochi: [4.5, 3.5, 4.5, 3, 5]
		};
		var base = {
			labels: ['デザイン性', '更新頻度', '情報整理', 'アクセシビリティ', '中学生向け'],
			datasets: [{
				label: 'DataSet',
				fillColor: 'rgba(151,187,205,0.2)',
				strokeColor: 'rgba(151,187,205,1)',
				pointColor: 'rgba(151,187,205,1)',
				pointStrokeColor: '#fff',
				pointHighlightFill: '#fff',
				pointHighlightStroke: 'rgba(151,187,205,1)',
			}]
		};
		$.each($('.evaluation-point'), function() {
			var kosen = $(this).data('kosen');
			var data = base;
			data.datasets[0].data = kosenData[kosen];
			var ctx = $(this).find('.radarchart').get(0).getContext('2d');
			new Chart(ctx).Radar(data, {
				scaleOverride: true,
				scaleSteps: 5,
				scaleStepWidth : 1,
				scaleStartValue : 0
			});
			var html = $('#announceTemplate').render(
			{'data': kosenData[kosen]},
			{
				getStar: function(point) {
					var str = '';
					var count = 0;
					var star = [
						'<i class="fa fa-lg fa-star"></i>',
						'<i class="fa fa-lg fa-star-half-o"></i>',
						'<i class="fa fa-lg fa-star-o"></i>'
					];
					for (var i = 0; i < Math.floor(point); i++) {
						str += star[0];
						count++;
					}
					if (point % 1 === 0.5) {
						str += star[1];
						count++;
					}
					for (var i = count; i < 5; i++) {
						str += star[2];
					}
					str += ' (' + formatNum(point) + ')';
					return str;
				},
				sumArray: function(array) {
					var sum = 0;
					for (var i = 0; i < array.length; i++) {
						sum += array[i];
					}
					return formatNum(sum);
				}
			});
			$(this).find('.evaluation-point-table').html(html);
		});
	});


})(jQuery, Chart, window, void 0);
