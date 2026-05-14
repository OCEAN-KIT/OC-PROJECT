import { createFileRoute, redirect } from '@tanstack/react-router'

// 1. / 경로 route를 만든다.
// 2. 이 route가 로드되기 전에 beforeLoad를 실행한다.
// 3. beforeLoad에서 /home으로 redirect를 던진다.
// 4. 그러면 / 화면은 렌더링 되지 않고 home으로 이동한다.
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/home' })
  },
})
