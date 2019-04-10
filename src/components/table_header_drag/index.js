import React, { Component } from 'react'
import WithDragDropContext from '@src/libs/share_HTML5Backend'
import Card from './Card'
import './index.less'

@WithDragDropContext
export default class Container extends Component {

	static defaultProps = {
		filterSortItems: []
	}

	render() {
		const { cards, onChangeCheckbox, moveCard, Item, filterSortItems, isNotFilter } = this.props

		return (
			<div>
				{
					cards.map((card, i) => {
						let filter = [...filterSortItems]
						if (!isNotFilter && i === cards.length - 1) {
							filter.push(card.key)
						}
						return <Card
							onChangeCheckbox={onChangeCheckbox}
							filterSortItems={filter}
							key={'cardtitle' + card.key + i}
							index={i}
							column={card}
							Item={Item}
							moveCard={moveCard}
						/>
					})
				}
			</div>
		)
	}
}
