(function () {

	let FILTER_LIST_SELECTOR = '.filter';
	let ACTIVE_FILTER_SELECTOR = '.active';

	class Gallery {
		constructor(requireFilter, requireWorks, worksList) {
			this.requireFilter = requireFilter;
			this.requireWorks = requireWorks;
			this.worksList = worksList;
			this.visibleWorksId = [];
			this.hiddenWorksId = [];
			this.allTags = [];
			this._buildFilerAndWorkHTML(this.requireFilter, this.requireWorks, this.worksList);
			this.updateModel("All");
			this.updateView(this.visibleWorksId, this.hiddenWorksId);
			this.requireFilter.find(FILTER_LIST_SELECTOR).on('click', 'a', this.clickHandler.bind(this));
		}
		clickHandler(event) {
			let previousElement = this.requireFilter.find(ACTIVE_FILTER_SELECTOR);
			previousElement.toggleClass("active");
			$(event.target).parent().toggleClass("active");
			this.updateModel(event.target.id);
			this.updateView(this.visibleWorksId, this.hiddenWorksId);
		}
		updateView(toShow, toHide) {
			_.each(toShow, function (value) {
				$('#' + value).fadeIn("fast");
			});
			_.each(toHide, function (value) {
				$('#' + value).fadeOut("fast");
			});
		}
		updateModel(tag) {
			let _this = this;
			_this.visibleWorksId = [];
			_this.hiddenWorksId = [];
			if (tag == "All") {
				_this._showAllModel(_this.worksList);
				return;
			}
			_.each(_this.allTags, function (arr, index) {
				if (_.contains(arr, tag)) {
					_this.visibleWorksId.push(index);
				}
				else {
					_this.hiddenWorksId.push(index);
				}
			});
		}
		_showAllModel(worksList) {
			let _this = this;
			_.each(worksList, function (value, i) {
				_this.visibleWorksId.push(i);
			});
		}
		_buildFilerAndWorkHTML(filterTargetNode, worksTargetNode, worksList) {
			let _this = this;
			_.each(worksList, function (value, i) {
				worksTargetNode.append(_this._buildSingleWorkHTML(value, i));
				_this.allTags.push(value.tags);
			});
			let uniqTags = _.uniq(_.flatten(_this.allTags));
			uniqTags.unshift("All");
			filterTargetNode.append(_this._buldFilterHTML(uniqTags));
		}
		_buldFilterHTML(tags) {
			let filterHolder = $(`<ul class="filter" ></ul>`);
			_.each(tags, function (value, index) {
				let active = (value === 'All') ? 'active' : undefined;
				let filter = $(`
				<li class="${active}">
					<a id="${value}" class="name hvr-back-pulse" href="#/${value}">${value}</a>
				</li>
				`);
				filterHolder.append(filter);
			});
			return filterHolder;
		}
		_buildSingleWorkHTML(singleWorkObj, id) {
			let workWrapper = $(`<div class="item-wrapper" id="${id}"></div>`);
			let imgContainer = $(`
			<div class="view view-first img-div">
			<img src="${singleWorkObj.image}" alt="">
				<div class="mask">
					<p>${singleWorkObj.description}</p>
					<a href="${singleWorkObj.linkToDemo}" class="info">Demo</a>
					<a href="${singleWorkObj.linkToCode}" class="info">Code</a>
				</div>
			</div>
			`);
			let descripContainer = $(`
			<div class="description">
				<a href="${singleWorkObj.linkToDemo}">
					<h5>${singleWorkObj.title}</h5>
				</a>
			</div>
			`);
			let tagsContainer = $(`<div class="tags"><i class="fa fa-tag"></i></div>`);
			_.each(singleWorkObj.tags, function (value, index, list) {
				let singleTag = $(`<span> ${value} </span>`);
				tagsContainer.append(singleTag);
				if (_.last(list) !== value) {
					let separator = $(`<i> | </i>`);
					tagsContainer.append(separator);
				}
			});
			descripContainer.append(tagsContainer);
			workWrapper.append(descripContainer);
			workWrapper.append(imgContainer);
			return workWrapper;
		}
	}

	window.gallery1 = new Gallery($(".require-filter"), $(".require-works"), data);
}());