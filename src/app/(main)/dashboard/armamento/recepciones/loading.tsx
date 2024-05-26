import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  PageTemplate,
} from '@/modules/layout/templates/page'
import { Skeleton } from '@/modules/common/components/skeleton'

export default function Loading() {
  return (
    <PageTemplate>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <Skeleton className="w-[250px] h-[24px]" />
          </PageHeaderTitle>
          <PageHeaderDescription>
            <Skeleton className="w-[150px] h-[16px]" />
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Skeleton className="w-[250px] h-[32px]" />
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <div className="flex w-full justify-between">
          <Skeleton className="w-[250px] h-[32px]" />
          <Skeleton className="w-[150px] h-[32px]" />
        </div>
        <Skeleton className="w-full h-[400px]" />
      </PageContent>
    </PageTemplate>
  )
}
