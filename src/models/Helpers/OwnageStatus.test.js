import OwnageStatus from "./OwnageStatus";

describe('OwnageStatus', () => {
	test('.getDefault', () => {
		expect(OwnageStatus.getDefault()).toBe('DEFAULT');
	});

	test.each`
	status | expected
	${''} | ${OwnageStatus.statuses.DEFAULT}
	${OwnageStatus.statuses.DEFAULT} | ${OwnageStatus.statuses.DOWNLOADABLE}
	${OwnageStatus.statuses.DOWNLOADABLE} | ${OwnageStatus.statuses.OWNED}
	${OwnageStatus.statuses.OWNED} | ${OwnageStatus.statuses.DEFAULT}
	`('.getNext($status)', ({status, expected}) => {
		expect(OwnageStatus.getNext(status)).toBe(expected);
	});
});
