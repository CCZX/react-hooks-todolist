import React, { useState, useMemo, useCallback, useEffect } from 'react'
import Item from './todoItem'
import { CUR_STATE } from './../constants'
import './index.scss'
import './../style/icon/iconfont.css'

function ToDoList() {
  // 初始化todolist数据
  const initTodos = JSON.parse(window.localStorage.getItem('todos'))
  const [todos, setTodos] = useState(initTodos || []) // [{}, {}, ...]

  // undo、redo时操作的数组
  const [redoStack, setRedoStack] = useState([])

  // 新的todo项内容
  const [inpValue, setInpValue] = useState('')

  // 状态选择：所有、已完成、未完成
  const [curState, setCurState] = useState(CUR_STATE.all)

  // 全选以及未全选状态判断
  const isSelectAll = todos.every(item => item.completed)
  const hasCompleted = todos.some(item => item.completed)

  // 未完成todo项的数量
  const noCompletedItems = todos.filter(item => !item.completed).length

  // 使用useMemo，只有在Todos/curState变化时才更新状态
  const memoTodos = useMemo(() => todos, [todos])
  const memoCurState = useMemo(() => curState, [curState])

  // 当Todos改变时更新缓存中的数据
  useEffect(() => {
    window.localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // 添加新的todo项
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inpValue) return
    const item = {
      id: Date.now(),
      active: inpValue,
      completed: false
    }
    const newTodos = [...todos, item]
    setTodos(newTodos)
    setInpValue('')
  }

  const handleInpChange = (e) => {
    const value = e.target.value
    setInpValue(value)
  }

  // 全选/反选操作
  const toggleSelectAll = () => {
    const newTodos = todos.map(item => {
      item.completed = !isSelectAll
      return item
    })
    setTodos(newTodos)
  }

  // 修改某项todo内容，使用useCallback，只有Todos变化时才更新该函数状态
  const modifyItem = useCallback((id, text) => {
    const newTodos = todos.map(item => {
      if (item.id === id) {
        item.active = text
      }
      return item
    })
    setTodos(newTodos)
  }, [todos])

  // 删除某项todo
  const deleteItem = useCallback((id) => {
    const newTodos = todos.filter(item => item.id !== id)
    setTodos(newTodos)
  }, [todos])

  // 切换某项todo的状态
  const toggleItem = useCallback((id) => {
    const newTodos = todos.map(item => {
      if (item.id === id) {
        item.completed = !item.completed
      }
      return item
    })
    setTodos(newTodos)
  }, [todos])

  // 前进后退操作
  const undo = () => {
    const tailItem = todos[todos.length - 1]
    const newTodos = todos.slice(0, todos.length - 1)
    setTodos(newTodos)
    setRedoStack([...redoStack, tailItem])
  }

  const redo = () => {
    const tailItem = redoStack[redoStack.length - 1]
    const newRedoStack = redoStack.slice(0, redoStack.length - 1)
    setTodos([...todos, tailItem])
    setRedoStack(newRedoStack)
  }

  // 清除所有已完成的todo项
  const clearCompletedItems = () => {
    const newTodos = todos.filter(item => !item.completed)
    setTodos(newTodos)
  }

  return (
    <div className="container">
        <header className="header">
          <form onSubmit={handleSubmit}>
            <i
              className={isSelectAll ? "icon iconfont selected-all" : "icon iconfont"}
              style={todos.length ? {} : {color: 'transparent'}}
              onClick={toggleSelectAll}
            >
              &#xe644;
            </i>
            <input className="inp" value={inpValue} placeholder="What need to be done?" onChange={handleInpChange} />
          </form>
        </header>
        <section className="body">
          <ul className="todo-list">
            {
              memoTodos && memoTodos.map((item, index) => {
                return <Item
                  key={item.id}
                  index={index}
                  itemData={item}
                  modifyItem={modifyItem}
                  deleteItem={deleteItem}
                  toggleItem={toggleItem}
                  curState={memoCurState}
                />
              })
            }
          </ul>
        </section>
        {
          todos.length > 0 && <footer className="footer">
            <div className="item">
              <span>
                <span style={{marginRight: '3px'}}>
                  { noCompletedItems }
                </span>
                item left
              </span>
            </div>
            <div className="item un-redo">
              <button onClick={undo} disabled={!todos.length} style={{marginRight: '3px'}}>undo</button>
              <button onClick={redo} disabled={!redoStack.length}>redo</button>
            </div>
            <div className="item select">
              <span className={curState === CUR_STATE.all ? 'active' : ''} onClick={() => setCurState(CUR_STATE.all)}>All</span>
              <span className={curState === CUR_STATE.actived ? 'active' : ''} onClick={() => setCurState(CUR_STATE.actived)}>Actived</span>
              <span className={curState === CUR_STATE.completed ? 'active' : ''} onClick={() => setCurState(CUR_STATE.completed)}>Completed</span>
            </div>
            <div className="item">
              <span className="clear-completed" onClick={clearCompletedItems} style={hasCompleted ? {opacity: 1} : {opacity: 0}}>
                Clear Completed
              </span>
            </div>
          </footer>
        }
      </div>
  )
}

export default ToDoList
