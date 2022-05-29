/* eslint-disable @typescript-eslint/no-unused-vars */
// 토론 게시물
const DebatePost = {
	method: '주제토론', // 토론방식
	category: '자유',
	title: '첫번째 게시글 입니다!',
	content: '첫번째 게시글의 내용입니다!',
	likeList: ['string'],
	unlikeList: ['string'],
	agreementList: [
		// 찬성인원리스트
		'string'
	],
	oppositionList: [
		// 반대인원리스트
		'string'
	],
	hits: 0,
	imgUrl: 'default',
	createDate: '2022년 4월 5일',
	id: '624c480198bd174b28ef930b'
}

// 커뮤니티 게시물
const CommunityPost = {
	category: '자유',
	title: '첫번째 게시글 입니다!',
	content: '첫번째 게시글의 내용입니다!',
	likeList: ['string'],
	unlikeList: ['string'],
	hits: 0,
	imgUrl: 'default',
	createDate: '2022년 4월 5일',
	id: '624c480198bd174b28ef930b'
}

// 유저
const User = {
	userId: 'jebong8691',
	email: 'jebong@gmail.com',
	nickname: '제봉팍',
	imgUrl: 'string',
	level: 1,
	point: 0,
	id: '624bc1796175813107b7ef2f',
	manageLevel: 0 // 관리자 등급
}

// ----- update

// 댓글 comment
const comment = {
	writer: {
		// 작성자
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	content: {
		// 내용
		type: mongoose.Mixed,
		required: true
	},
	createDate: {
		// 처리시간
		type: Date,
		default: Date.now
	},
	recList: [
		{} // 추천 인원
	],
	replyId: [
		{
			// 답글 id
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Reply'
		}
	]
}

// 대댓글 reply
const reply = {
	writer: {
		// 작성자
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	target: {
		// 대상자 (discord 태그하듯 필요해서)
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	content: {
		// 내용
		type: mongoose.Mixed,
		required: true
	},
	createDate: {
		// 처리시간
		type: Date,
		default: Date.now
	},
	recList: [
		{} // 추천 인원
	]
}

// 신고 report
const report = {
	contentType: 'comment', // 신고한 내용이 게시물인지 댓글, 답글 인지
	contentId: '624bc1796175813107b7ef2f',
	writer: 'user',
	target: 'user',
	content: 'content',
	reportTypes: [
		// 신고항목 ex) 1 : 욕설 2: 불법 광고 .. 이런느낌
		1, 2, 3
	],
	createDate: '2022년 4월 5일',
	id: '624c480198bd174b28ef930b'
}
