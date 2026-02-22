<script setup lang="ts" generic="TData, TValue">
import { FlexRender, useVueTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type ColumnDef, type SortingState } from '@tanstack/vue-table'
import { ref } from 'vue'

const props = defineProps<{ columns: ColumnDef<TData, TValue>[]; data: TData[] }>()
const sorting = ref<SortingState>([])
const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
  state: { get sorting() { return sorting.value } },
})
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <template v-if="!header.isPlaceholder">
                <div :class="{ 'cursor-pointer select-none': header.column.getCanSort() }" @click="header.column.getToggleSortingHandler()?.($event)">
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                </div>
              </template>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow><TableCell :colspan="columns.length" class="h-24 text-center">No results.</TableCell></TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
    <div class="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">Previous</Button>
      <span class="text-sm text-muted-foreground">Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}</span>
      <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">Next</Button>
    </div>
  </div>
</template>
