import { Category } from "../../models/category-store"
import { UserChef } from "../../models/user-store"
import { ChefItemModel } from "../../screens/chefs/chef-item"
export type ScreenType = "dishDetail" | "menuChef"
export const useChef = () => {
  const formatDishesGroupedByChef = (dishes: UserChef[]): ChefItemModel[] => {
    return dishes.map((chef: UserChef) => {
      return {
        ...chef,
        category: getCategoriesName(chef.categories),
        currentIndexPage: 0,
        pageView: null,
        currentDishName: chef.dishes.length > 0 ? chef.dishes[0]?.title : "",
      }
    })
  }
  const getCategoriesName = (categories: Category[]): string => {
    let categoriesStr = ""
    if (categories && Array.isArray(categories)) {
      categories.forEach((category) => {
        categoriesStr += `${category.name} - `
      })
      return categoriesStr.substring(0, categoriesStr.length - 2)
    }

    return ""
  }

  return {
    formatDishesGroupedByChef,
  }
}
