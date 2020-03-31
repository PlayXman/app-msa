import { Config } from '../../config';

/**
 * Functions over "warez-bb.org" web
 */
class WarezBB {
	/**
	 * Opens search in new tab
	 * @param {string} title Searched item title
	 * @param {number} forumSectionType Param from `Config.vendors.warezBbOrg.forumId`
	 */
	static searchFor(title, forumSectionType) {
		const form = document.createElement('form');
		form.setAttribute('method', 'post');
		form.setAttribute('action', Config.vendors.warezBbOrg.searchUrl);
		form.setAttribute('target', '_blank');

		const inputs = [
			{
				name: 'search_keywords',
				val: title,
			},
			{
				name: 'search_forum',
				val: forumSectionType,
			},
			{
				name: 'search_terms',
				val: 'all',
			},
			{
				name: 'search_fields',
				val: 'titleonly',
			},
		];

		inputs.forEach((input) => {
			const i = document.createElement('input');
			i.setAttribute('type', 'text');
			i.setAttribute('name', input.name);
			i.setAttribute('value', input.val);
			form.appendChild(i);
		});

		document.body.appendChild(form);
		form.submit();
		form.remove();
	}
}

export default WarezBB;
