---
title: "맥OS 풀 높이 사이드바 창"
description: ""
coverImage: "/assets/img/2024-06-20-macOSfullheightsidebarwindow_0.png"
date: 2024-06-20 14:37
ogImage: 
  url: /assets/img/2024-06-20-macOSfullheightsidebarwindow_0.png
tag: Tech
originalTitle: "macOS full height sidebar window"
link: "https://medium.com/@bancarel.paul/macos-full-height-sidebar-window-62a214309a80"
---


요즘, macOS 앱에서 전체 높이 사이드바와 풍부한 툴바 및 타이틀바를 원했어요.

그럴 때 SwiftUI의 NavigationSplitView와 AppKit API의 NSSplitViewController를 사용하면 됩니다.

# SwiftUI 앱 라이프사이클에서

WindowGroup와 샘플 프로젝트에서 NavigationSplitView를 빠르게 경험했는데, 아주 쉽게 작동했어요:

<div class="content-ad"></div>

<img src="https://miro.medium.com/v2/resize:fit:1200/1*H0R5oiWQVLVOyNl686y6RA.gif" />

# 앱킷 앱 라이프사이클에서

하지만 NSHostingController를 사용하거나 심지어 AppKit 및 NSSplitViewController를 사용하여 실제 프로젝트로 돌아가면 (내 앱이 SwiftUI 앱 라이프사이클로 완전히 이관되지 않았기 때문에) 기본적으로 다른 동작을 하며 처음부터 왜 그런 건지 이해할 수 없습니다.

<img src="https://miro.medium.com/v2/resize:fit:1200/1*KeIibd3zjL-7Twq6vfFHtQ.gif" />

<div class="content-ad"></div>

저는 먼저 Xcode에서 창 보기 계층을 비교해 보려고 합니다:

![Window view hierarchy](/assets/img/2024-06-20-macOSfullheightsidebarwindow_0.png)

하지만 거의 비슷해 보입니다.

많은 연구 끝에 다음을 발견하고 시청했습니다:
- [SwiftUI 네비게이션 분할 보기에서 사이드바 버튼 사용하는 방법](https://stackoverflow.com/questions/78604429/using-sidebar-button-jump-in-swiftui-navigationsplitview-with-nshostingcontrolle/78615176#78615176)
- [Apple 개발자 비디오](https://developer.apple.com/videos/play/wwdc2020/10104/)

<div class="content-ad"></div>

저와 같이 프로젝트가 아직 SwiftUI 앱 라이프사이클로 전환되지 않았다면 다음과 같이 할 수 있습니다:

```js
// SwiftUI.NavigationSplitView를 NSHostingView 또는 NSHostingController와 함께 사용
// 👀 .fullSizeContentView를 살펴봅니다
let window = NSWindow(contentRect: .init(origin: .zero, size: .init(width: 800, height: 600)), styleMask: [.closable, .miniaturizable, .titled, .resizable, .fullSizeContentView], backing: .buffered, defer: false)
window.contentView = NSHostingView(rootView: ContentView())
window.center()
window.title = "Hello world"
let controller = NSWindowController(window: window)
controller.showWindow(nil)

...
struct ContentView: View {
    var body: some View {
        NavigationSplitView {
            Text("A")
        } content: {
            Text("B")
        } detail: {
            Text("C")
        }
    }
}
```

```js
// 👀 NSSplitViewController 사용
window = NSWindow(
    contentRect: NSRect(x: 0, y: 0, width: 800, height: 600),
    // 👀 .fullSizeContentView를 살펴봅니다
    styleMask: [.titled, .closable, .resizable, .miniaturizable, .fullSizeContentView],
    backing: .buffered,
    defer: false
)
window.center()
window.title = "Hello world"
window.titlebarAppearsTransparent = true
let toolbar = NSToolbar(identifier: "my-identifier")
toolbar.delegate = self
toolbar.allowsUserCustomization = false
toolbar.displayMode = .iconOnly
self.window?.toolbar = toolbar

// 👀 sidebarWithViewController를 살펴봅니다
let sidebarItem = NSSplitViewItem(sidebarWithViewController: SidebarViewController())
sidebarItem.allowsFullHeightLayout = true
sidebarItem.minimumThickness = 200
sidebarItem.maximumThickness = 300
sidebarItem.canCollapse = true
sidebarItem.isCollapsed = false
splitViewController.addSplitViewItem(sidebarItem)

// 👀 contentListWithViewController를 살펴봅니다
let mainContentItem = NSSplitViewItem(contentListWithViewController: MainContentViewController())
mainContentItem.allowsFullHeightLayout = true
splitViewController.addSplitViewItem(mainContentItem)

let windowController = NSWindowController(window: window)
windowController.contentViewController = splitViewController
windowController.showWindow(nil)

...

private extension NSToolbarItem.Identifier {
    static let searchItem: NSToolbarItem.Identifier = NSToolbarItem.Identifier(rawValue: "SearchItem")
}

extension AppDelegate: NSToolbarDelegate {
    func toolbarDefaultItemIdentifiers(_ toolbar: NSToolbar) -> [NSToolbarItem.Identifier] {
        return [
            .toggleSidebar,
            // 👀 sidebarTrackingSeparator를 살펴봅니다
            .sidebarTrackingSeparator,
            .flexibleSpace,
            .searchItem
        ]
    }

    func toolbarAllowedItemIdentifiers(_ toolbar: NSToolbar) -> [NSToolbarItem.Identifier] {
        return toolbarDefaultItemIdentifiers(toolbar)
    }

    func toolbar(_ toolbar: NSToolbar, itemForItemIdentifier itemIdentifier: NSToolbarItem.Identifier, willBeInsertedIntoToolbar flag: Bool) -> NSToolbarItem? {
        var toolbarItem: NSToolbarItem?

        switch itemIdentifier {
            case .toggleSidebar:
                let item = NSToolbarItem(itemIdentifier: .toggleSidebar)
                item.image = NSImage(systemSymbolName: "sidebar.left", accessibilityDescription: nil)
                toolbarItem = item
            case .sidebarTrackingSeparator:
                let item = NSToolbarItem(itemIdentifier: .sidebarTrackingSeparator)
                toolbarItem = item
            case .searchItem:
                let searchToolbarItem = NSSearchToolbarItem(itemIdentifier: .searchItem)
                searchToolbarItem.searchField = .init()
                toolbarItem = searchToolbarItem
            default:
                toolbarItem = nil
        }
        toolbarItem?.isBordered = true

        return toolbarItem
    }
}
```

AppKit에서 NSSplitViewController를 사용하는 경우 코드가 조금 더 구체적이지만 윈도우의 styleMask에 .fullSizeContentView를 사용하고 sidebarTrackingSeparator를 사용하는 것이 주요 포인트입니다. AppKit은 sidebarTrackingSeparator를 이용하여 타이틀 바 내에 구분선을 배치하고 전체 높이의 바를 효과적으로 만듭니다.

<div class="content-ad"></div>

그럼, 이제 yourNavigationSplitView가 WindowGroup를 사용했을 때와 동일한 스타일과 동작을 갖게 되었습니다.

![image](https://miro.medium.com/v2/resize:fit:1200/1*s28vqaok0sNDgQZdjF4qKA.gif)

앞으로 다른 사람들에게 도움이 되길 바랍니다. 정말 이 부분에 꽤 많은 시간을 소비했었거든 :(