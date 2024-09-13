import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const items = await prisma.renglon.findMany()

  const receptions = await prisma.recepcion.findMany({
    include: {
      renglones: {
        include: {
          renglon: true,
        },
      },
    },
  })
  const dispatches = await prisma.despacho.findMany({
    include: {
      renglones: {
        include: {
          renglon: true,
        },
      },
    },
  })

  const devolutions = await prisma.devolucion.findMany({
    include: {
      renglones: {
        include: {
          renglon: true,
          seriales: true,
        },
      },
    },
  })

  const loans = await prisma.prestamo.findMany({
    include: {
      renglones: {
        include: {
          renglon: true,
          seriales: true,
        },
      },
    },
  })

  const quantitiesDispatchedByDispatches = dispatches.map((dispatch) => {
    const dispatchDetails = dispatch.renglones
    const dispatchItems = dispatchDetails.map((detail) => {
      return {
        itemId: detail.renglon.id,
        quantity: detail.cantidad,
      }
    })

    return {
      dispatchId: dispatch.id,
      items: dispatchItems,
    }
  })

  const quantitiesDevolutionsByDevolutions = devolutions.map((devolution) => {
    const devolutionDetails = devolution.renglones
    const devolutionItems = devolutionDetails.map((detail) => {
      return {
        itemId: detail.renglon.id,
        quantity: detail.seriales.length,
      }
    })

    return {
      devolutionId: devolution.id,
      items: devolutionItems,
    }
  })

  const quantitiesReceivedByReceptions = receptions.map((reception) => {
    const receptionDetails = reception.renglones
    const receptionItems = receptionDetails.map((detail) => {
      return {
        itemId: detail.renglon.id,
        quantity: detail.es_recepcion_liquidos ? 0 : detail.cantidad,
      }
    })

    return {
      receptionId: reception.id,
      items: receptionItems,
    }
  })

  const quantitiesLoanedByLoans = loans.map((loan) => {
    const loanDetails = loan.renglones
    const loanItems = loanDetails.map((detail) => {
      return {
        itemId: detail.renglon.id,
        quantity: detail.seriales.length,
      }
    })

    return {
      loanId: loan.id,
      items: loanItems,
    }
  })

  const quantityDevolutionsByItems = items.map((item) => {
    const quantityDevolutions = quantitiesDevolutionsByDevolutions.reduce(
      (acc, devolution) => {
        const itemQuantity =
          devolution.items.find(
            (devolutionItem) => devolutionItem.itemId === item.id
          )?.quantity || 0
        return acc + itemQuantity
      },
      0
    )
    return {
      itemId: item.id,
      quantityDevolutions,
    }
  })

  const quantityDispatchedByItems = items.map((item) => {
    const quantityDispatched = quantitiesDispatchedByDispatches.reduce(
      (acc, dispatch) => {
        const itemQuantity =
          dispatch.items.find((dispatchItem) => dispatchItem.itemId === item.id)
            ?.quantity || 0
        return acc + itemQuantity
      },
      0
    )
    return {
      itemId: item.id,
      quantityDispatched,
    }
  })

  const quantityReceivedByItems = items.map((item) => {
    const quantityReceived = quantitiesReceivedByReceptions.reduce(
      (acc, reception) => {
        const itemQuantity =
          reception.items.find(
            (receptionItem) => receptionItem.itemId === item.id
          )?.quantity || 0
        return acc + itemQuantity
      },
      0
    )
    return {
      itemId: item.id,
      quantityReceived,
    }
  })

  const quantityLoanedByItems = items.map((item) => {
    const quantityLoaned = quantitiesLoanedByLoans.reduce((acc, loan) => {
      const itemQuantity =
        loan.items.find((loanItem) => loanItem.itemId === item.id)?.quantity ||
        0
      return acc + itemQuantity
    }, 0)
    return {
      itemId: item.id,
      quantityLoaned,
    }
  })

  const currentStockByItems = items.map((item) => {
    const quantityDevolutions =
      quantityDevolutionsByItems.find(
        (itemQuantity) => itemQuantity.itemId === item.id
      )?.quantityDevolutions || 0
    const quantityDispatched =
      quantityDispatchedByItems.find(
        (itemQuantity) => itemQuantity.itemId === item.id
      )?.quantityDispatched || 0
    const quantityReceived =
      quantityReceivedByItems.find(
        (itemQuantity) => itemQuantity.itemId === item.id
      )?.quantityReceived || 0

    const quantityLoaned =
      quantityLoanedByItems.find(
        (itemQuantity) => itemQuantity.itemId === item.id
      )?.quantityLoaned || 0

    const currentStock =
      quantityDevolutions -
      quantityDispatched +
      quantityReceived -
      quantityLoaned
    return {
      itemId: item.id,
      currentStock,
    }
  })
  items.forEach(async (item) => {
    await prisma.renglon.update({
      where: {
        id: item.id,
      },
      data: {
        stock_actual:
          currentStockByItems.find(
            (currentStock) => currentStock.itemId === item.id
          )?.currentStock || 0,
      },
    })
  })
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
