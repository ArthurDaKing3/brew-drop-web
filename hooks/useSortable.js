
import { useEffect, useRef } from 'react';


function arrayMove(arr, from, to) {
  if (from === to) return arr;

  const newArr = [...arr];
  const [moved] = newArr.splice(from, 1);

  newArr.splice(to, 0, moved);

  return newArr;
}


export async function useSortable(listRef, setList, handleClass){

    const sortableRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        (
            async () => {
                const Sortable = (await import('sortablejs')).default;
                if (!isMounted || !listRef.current) return;

                sortableRef.current = Sortable.create(listRef.current, {
                    handle: `.${handleClass}`,     
                    animation: 150,             
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    dragClass: 'sortable-drag',
                    onEnd: (evt) => {
                        const { oldIndex, newIndex } = evt;
                        if (oldIndex == null || newIndex == null) return;

                        setList(prev => arrayMove(prev, oldIndex, newIndex));
                    },
                });
            }
        )();

        return () => {
            isMounted = false;
            sortableRef.current?.destroy();
            sortableRef.current = null;
        };

    }, []);

}