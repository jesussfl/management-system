// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from '@/modules/common/components/tabs/tabs'
// import { PageContent } from '../../templates/page'
// import { Card, CardContent } from '@/modules/common/components/card/card'

// export default async function TabsTemplate({
//   activeTable,
//   deletedTable,
// }: {
//   activeTable: React.ReactNode
//   deletedTable: React.ReactNode
// }) {
//   return (
//     <Tabs>
//       <TabsList className="mx-5" defaultValue="Activos">
//         <TabsTrigger value="Activos">Activos</TabsTrigger>
//         <TabsTrigger value="Eliminados">Eliminados</TabsTrigger>
//       </TabsList>
//       <TabsContent value="Activos">
//         <PageContent>
//           <Card>
//             <CardContent>{activeTable}</CardContent>
//           </Card>
//         </PageContent>
//       </TabsContent>

//       <TabsContent value="Eliminados">
//         <PageContent>
//           <Card>
//             <CardContent>{deletedTable}</CardContent>
//           </Card>
//         </PageContent>
//       </TabsContent>
//     </Tabs>
//   )
// }
