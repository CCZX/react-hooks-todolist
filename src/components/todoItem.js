import React, { useState, useEffect, useRef, memo } from 'react'
import PropTypes from 'prop-types'
import { CUR_STATE } from './../constants'
import './todoItem.scss'

const ToDoItem = memo(({itemData, curState, modifyItem, deleteItem, toggleItem}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [show, setShow] = useState(true)
  const inpNode = useRef(null)
  // 存储最初的值，useRef在组件整个更新过程中不变
  const originTodoActive = useRef(itemData.active)

  // 根据当前展示的条件以及当前todo项的completed值判断当前todo是否展示，
  useEffect(() => {
    let isShowItem = true
    if (curState === CUR_STATE.actived) {
      isShowItem = !itemData.completed
    } else if (curState === CUR_STATE.completed) {
      isShowItem = itemData.completed
    }
    setShow(isShowItem)
  }, [curState, itemData.completed])

  useEffect(() => {
    const inpDOM = inpNode.current
    if (inpDOM) {
      inpDOM.focus()
      inpDOM.select()
    }
  }, [isEdit])

  // 保存更改
  const saveModify = () => {
    setIsEdit(false)
    // 如果修改后的值为空则设置为初始值
    if (!itemData.active) {
      modifyItem(itemData.id, originTodoActive.current)
      return
    }
    // 重新给初始值赋值
    originTodoActive.current = itemData.active
  }

  return (
    <>
      {
        show && <li className="todo-item">
          <div className={isEdit ? "content edit" : "content"}>
            <div className="view" onDoubleClick={() => setIsEdit(true)}>
              <input type="checkbox" className="check-input"
                checked={itemData.completed}
                onChange={() => toggleItem(itemData.id)}
              />
              <label
                style={!itemData.completed ? {textDecoration: 'none'} : {textDecoration: 'line-through'}}
                className="active-text"
              >
                {itemData.active}
              </label>
              <i className="icon iconfont" onClick={() => deleteItem(itemData.id)}>+</i>
            </div>
            <div className="edit">
              <input className="edit-inp" value={itemData.active}
                ref={inpNode}
                onChange={(e) => modifyItem(itemData.id, e.target.value)}
                onKeyUp={(e) => {e.keyCode === 13 && saveModify()}}
                onBlur={saveModify}
              />
            </div>
          </div>
        </li>
      }
    </>
  )
})

ToDoItem.propType = {
  itemData: PropTypes.object.isRequired,
  curState: PropTypes.string.isRequired,
  modifyItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  toggleItem: PropTypes.func.isRequired
}

export default ToDoItem
