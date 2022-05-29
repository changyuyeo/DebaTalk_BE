//* common
export type SortKeyType = 'likeList' | 'hits' | 'createDate'

//* post
export type Category =
	| '자유'
	| '유머'
	| '사회'
	| '문화'
	| '교육'
	| '과학/IT'
	| '역사'
	| '철학'
	| '스포츠'
	| '환경'

//* debate post
export type DebateMethodType = '주제토론' | '찬반토론' | '끝장토론'
export type DebateCategory =
	| '정치'
	| '경제'
	| '사회'
	| '문화'
	| '교육'
	| '과학/IT'
	| '역사'
	| '철학'
	| '스포츠'
	| '환경'
	| '기타'
