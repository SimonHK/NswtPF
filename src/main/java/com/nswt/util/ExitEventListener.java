package com.nswt.util;

/**
 * Created by hongkai on 2017/4/25.
 * 清除事件监听器，可以为Mapx等容器设置清除事件监听器，<br>
 * 当容器中有元素被清除时会调用监听器的onExit方法。
 */
public abstract class ExitEventListener {
    /**
     * 键值对从容器中清除时会调用此方法
     *
     * @param key
     * @param value
     */
    public abstract void onExit(Object key, Object value);
}
