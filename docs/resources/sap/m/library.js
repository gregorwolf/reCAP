/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/base/DataType","sap/ui/base/EventProvider","sap/ui/core/Control","sap/base/util/ObjectPath","sap/ui/util/openWindow","sap/ui/core/library","sap/base/strings/capitalize","sap/ui/thirdparty/jquery","sap/base/assert","sap/base/Log","sap/base/util/defineLazyProperty","sap/base/security/encodeCSS","./AvatarShape","./AvatarSize","./AvatarType","./AvatarColor","./AvatarImageFitType","./Support"],function(e,t,a,n,i,o,r,s,l,p,m,u,c,d,g,f,S,T){"use strict";sap.ui.getCore().initLibrary({name:"sap.m",version:"1.90.1",dependencies:["sap.ui.core"],designtime:"sap/m/designtime/library.designtime",types:["sap.m.AvatarImageFitType","sap.m.AvatarShape","sap.m.AvatarSize","sap.m.AvatarType","sap.m.AvatarColor","sap.m.BackgroundDesign","sap.m.BadgeState","sap.m.BadgeAnimationType","sap.m.BarDesign","sap.m.BreadcrumbsSeparatorStyle","sap.m.ButtonType","sap.m.CarouselArrowsPlacement","sap.m.DateTimeInputType","sap.m.DeviationIndicator","sap.m.DialogRoleType","sap.m.DialogType","sap.m.DraftIndicatorState","sap.m.FacetFilterListDataType","sap.m.FacetFilterType","sap.m.FlexAlignContent","sap.m.FlexAlignItems","sap.m.FlexAlignSelf","sap.m.FlexDirection","sap.m.FlexJustifyContent","sap.m.FlexRendertype","sap.m.FlexWrap","sap.m.FrameType","sap.m.GenericTagDesign","sap.m.GenericTagValueState","sap.m.GenericTileMode","sap.m.GenericTileScope","sap.m.HeaderLevel","sap.m.IBarHTMLTag","sap.m.IconTabDensityMode","sap.m.IconTabFilterDesign","sap.m.IconTabHeaderMode","sap.m.ImageMode","sap.m.InputTextFormatMode","sap.m.InputType","sap.m.LabelDesign","sap.m.LightBoxLoadingStates","sap.m.LinkConversion","sap.m.ListGrowingDirection","sap.m.ListHeaderDesign","sap.m.ListKeyboardMode","sap.m.ListMode","sap.m.ListSeparators","sap.m.ListType","sap.m.LoadState","sap.m.MenuButtonMode","sap.m.ObjectHeaderPictureShape","sap.m.ObjectMarkerType","sap.m.ObjectMarkerVisibility","sap.m.OverflowToolbarPriority","sap.m.P13nPanelType","sap.m.P13nConditionOperation","sap.m.PageBackgroundDesign","sap.m.PanelAccessibleRole","sap.m.PDFViewerDisplayType","sap.m.PlacementType","sap.m.PlanningCalendarBuiltInView","sap.m.PlanningCalendarStickyMode","sap.m.PopinDisplay","sap.m.PopinLayout","sap.m.QuickViewGroupElementType","sap.m.RatingIndicatorVisualMode","sap.m.ScreenSize","sap.m.SelectColumnRatio","sap.m.SelectionDetailsActionLevel","sap.m.SelectListKeyboardNavigationMode","sap.m.SelectType","sap.m.Size","sap.m.SplitAppMode","sap.m.StandardTileType","sap.m.StepInputStepModeType","sap.m.StepInputValidationMode","sap.m.Sticky","sap.m.StringFilterOperator","sap.m.SwipeDirection","sap.m.SwitchType","sap.m.TabsOverflowMode","sap.m.TileSizeBehavior","sap.m.TimePickerMaskMode","sap.m.TitleAlignment","sap.m.TokenizerRenderMode","sap.m.ToolbarDesign","sap.m.ToolbarStyle","sap.m.UploadState","sap.m.ValueColor","sap.m.ValueCSSColor","sap.m.VerticalPlacementType","sap.m.WrappingType","sap.m.WizardRenderMode","sap.m.semantic.SemanticRuleSetType"],interfaces:["sap.m.IBar","sap.m.IBadge","sap.m.IBreadcrumbs","sap.m.IconTab","sap.m.IScale","sap.m.semantic.IGroup","sap.m.semantic.IFilter","sap.m.semantic.ISort","sap.m.ObjectHeaderContainer","sap.m.IOverflowToolbarContent","sap.m.IOverflowToolbarFlexibleContent","sap.m.IHyphenation"],controls:["sap.m.ActionListItem","sap.m.ActionSelect","sap.m.ActionSheet","sap.m.App","sap.m.Avatar","sap.m.Bar","sap.m.BusyDialog","sap.m.BusyIndicator","sap.m.Button","sap.m.Breadcrumbs","sap.m.Carousel","sap.m.CheckBox","sap.m.ColumnHeaderPopover","sap.m.ColumnListItem","sap.m.ColorPalette","sap.m.ColorPalettePopover","sap.m.ComboBox","sap.m.ComboBoxTextField","sap.m.ComboBoxBase","sap.m.CustomListItem","sap.m.CustomTile","sap.m.CustomTreeItem","sap.m.DatePicker","sap.m.DateRangeSelection","sap.m.DateTimeField","sap.m.DateTimeInput","sap.m.DateTimePicker","sap.m.Dialog","sap.m.DisplayListItem","sap.m.DraftIndicator","sap.m.ExpandableText","sap.m.FacetFilter","sap.m.FacetFilterItem","sap.m.FacetFilterList","sap.m.FeedContent","sap.m.FeedInput","sap.m.FeedListItem","sap.m.FlexBox","sap.m.FormattedText","sap.m.GenericTag","sap.m.GenericTile","sap.m.GroupHeaderListItem","sap.m.GrowingList","sap.m.HBox","sap.m.HeaderContainer","sap.m.IconTabBar","sap.m.IconTabBarSelectList","sap.m.IconTabFilterExpandButtonBadge","sap.m.IconTabHeader","sap.m.Image","sap.m.ImageContent","sap.m.Input","sap.m.InputBase","sap.m.InputListItem","sap.m.Label","sap.m.LightBox","sap.m.Link","sap.m.List","sap.m.ListBase","sap.m.ListItemBase","sap.m.MaskInput","sap.m.Menu","sap.m.MenuButton","sap.m.MessagePage","sap.m.MessagePopover","sap.m.MessageView","sap.m.MessageStrip","sap.m.MultiComboBox","sap.m.MultiEditField","sap.m.MultiInput","sap.m.NavContainer","sap.m.NewsContent","sap.m.NumericContent","sap.m.NotificationList","sap.m.NotificationListBase","sap.m.NotificationListItem","sap.m.NotificationListGroup","sap.m.PagingButton","sap.m.PlanningCalendarLegend","sap.m.ObjectAttribute","sap.m.ObjectHeader","sap.m.ObjectIdentifier","sap.m.ObjectListItem","sap.m.ObjectMarker","sap.m.ObjectNumber","sap.m.ObjectStatus","sap.m.OverflowToolbar","sap.m.OverflowToolbarButton","sap.m.OverflowToolbarToggleButton","sap.m.P13nColumnsPanel","sap.m.P13nGroupPanel","sap.m.P13nSelectionPanel","sap.m.P13nDimMeasurePanel","sap.m.P13nConditionPanel","sap.m.P13nDialog","sap.m.P13nFilterPanel","sap.m.P13nPanel","sap.m.P13nSortPanel","sap.m.Page","sap.m.Panel","sap.m.PDFViewer","sap.m.PlanningCalendar","sap.m.PlanningCalendarHeader","sap.m.Popover","sap.m.ProgressIndicator","sap.m.PullToRefresh","sap.m.QuickView","sap.m.QuickViewBase","sap.m.QuickViewCard","sap.m.QuickViewPage","sap.m.RadioButton","sap.m.RadioButtonGroup","sap.m.RangeSlider","sap.m.RatingIndicator","sap.m.ResponsivePopover","sap.m.ScrollContainer","sap.m.SearchField","sap.m.SegmentedButton","sap.m.Select","sap.m.SelectDialog","sap.m.SelectList","sap.m.SelectionDetails","sap.m.Shell","sap.m.SimpleFixFlex","sap.m.SinglePlanningCalendar","sap.m.SinglePlanningCalendarGrid","sap.m.SinglePlanningCalendarMonthGrid","sap.m.Slider","sap.m.SliderTooltip","sap.m.SliderTooltipBase","sap.m.SliderTooltipContainer","sap.m.SlideTile","sap.m.StepInput","sap.m.SplitApp","sap.m.SplitContainer","sap.m.StandardListItem","sap.m.StandardTreeItem","sap.m.StandardTile","sap.m.Switch","sap.m.Table","sap.m.TableSelectDialog","sap.m.TabContainer","sap.m.TabStrip","sap.m.Text","sap.m.TextArea","sap.m.Tile","sap.m.TileContainer","sap.m.TileContent","sap.m.TimePicker","sap.m.TimePickerInputs","sap.m.TimePickerClock","sap.m.TimePickerClocks","sap.m.TimePickerSliders","sap.m.Title","sap.m.ToggleButton","sap.m.Token","sap.m.Tokenizer","sap.m.Toolbar","sap.m.ToolbarSpacer","sap.m.ToolbarSeparator","sap.m.Tree","sap.m.TreeItemBase","sap.m.UploadCollection","sap.m.UploadCollectionToolbarPlaceholder","sap.m.upload.UploadSet","sap.m.VBox","sap.m.ViewSettingsDialog","sap.m.WheelSlider","sap.m.WheelSliderContainer","sap.m.Wizard","sap.m.WizardStep","sap.m.semantic.DetailPage","sap.m.semantic.SemanticPage","sap.m.semantic.ShareMenuPage","sap.m.semantic.FullscreenPage","sap.m.semantic.MasterPage"],elements:["sap.m.BadgeCustomData","sap.m.Column","sap.m.ColumnPopoverActionItem","sap.m.ColumnPopoverCustomItem","sap.m.ColumnPopoverItem","sap.m.ColumnPopoverSortItem","sap.m.FlexItemData","sap.m.FeedListItemAction","sap.m.IconTabFilter","sap.m.IconTabSeparator","sap.m.LightBoxItem","sap.m.OverflowToolbarLayoutData","sap.m.MaskInputRule","sap.m.MenuItem","sap.m.MessageItem","sap.m.MessagePopoverItem","sap.m.PageAccessibleLandmarkInfo","sap.m.P13nFilterItem","sap.m.P13nItem","sap.m.PlanningCalendarRow","sap.m.PlanningCalendarView","sap.m.P13nColumnsItem","sap.m.P13nDimMeasureItem","sap.m.P13nGroupItem","sap.m.P13nSortItem","sap.m.QuickViewGroup","sap.m.QuickViewGroupElement","sap.m.ResponsiveScale","sap.m.SegmentedButtonItem","sap.m.SelectionDetailsItem","sap.m.SelectionDetailsItemLine","sap.m.SinglePlanningCalendarDayView","sap.m.SinglePlanningCalendarMonthView","sap.m.SinglePlanningCalendarWeekView","sap.m.SinglePlanningCalendarWorkWeekView","sap.m.SinglePlanningCalendarView","sap.m.SuggestionItem","sap.m.TabContainerItem","sap.m.TabStripItem","sap.m.ToolbarLayoutData","sap.m.UploadCollectionItem","sap.m.UploadCollectionParameter","sap.m.upload.Uploader","sap.m.upload.UploadSetItem","sap.m.ViewSettingsCustomItem","sap.m.ViewSettingsCustomTab","sap.m.ViewSettingsFilterItem","sap.m.ViewSettingsItem","sap.m.plugins.ColumnResizer","sap.m.plugins.DataStateIndicator","sap.m.plugins.PluginBase","sap.m.semantic.AddAction","sap.m.semantic.CancelAction","sap.m.semantic.DeleteAction","sap.m.semantic.DiscussInJamAction","sap.m.semantic.EditAction","sap.m.semantic.FavoriteAction","sap.m.semantic.FilterAction","sap.m.semantic.FilterSelect","sap.m.semantic.FlagAction","sap.m.semantic.ForwardAction","sap.m.semantic.GroupAction","sap.m.semantic.GroupSelect","sap.m.semantic.MainAction","sap.m.semantic.MessagesIndicator","sap.m.semantic.MultiSelectAction","sap.m.semantic.NegativeAction","sap.m.semantic.OpenInAction","sap.m.semantic.PositiveAction","sap.m.semantic.PrintAction","sap.m.semantic.SaveAction","sap.m.semantic.SemanticButton","sap.m.semantic.SemanticControl","sap.m.semantic.SemanticSelect","sap.m.semantic.SemanticToggleButton","sap.m.semantic.SendEmailAction","sap.m.semantic.SendMessageAction","sap.m.semantic.ShareInJamAction","sap.m.semantic.SortAction","sap.m.semantic.SortSelect"],extensions:{flChangeHandlers:{"sap.m.ActionSheet":{moveControls:"default"},"sap.m.Avatar":"sap/m/flexibility/Avatar","sap.m.Bar":"sap/m/flexibility/Bar","sap.m.Button":"sap/m/flexibility/Button","sap.m.CheckBox":"sap/m/flexibility/CheckBox","sap.m.ColumnListItem":{hideControl:"default",unhideControl:"default"},"sap.m.CustomListItem":{hideControl:"default",unhideControl:"default",moveControls:"default"},"sap.m.DatePicker":{hideControl:"default",unhideControl:"default"},"sap.m.Dialog":"sap/m/flexibility/Dialog","sap.m.ExpandableText":"sap/m/flexibility/ExpandableText","sap.m.FlexBox":{hideControl:"default",unhideControl:"default",moveControls:"default"},"sap.m.HBox":{hideControl:"default",unhideControl:"default",moveControls:"default"},"sap.m.IconTabBar":{moveControls:"default"},"sap.m.IconTabFilter":"sap/m/flexibility/IconTabFilter","sap.m.Image":{hideControl:"default",unhideControl:"default"},"sap.m.Input":{hideControl:"default",unhideControl:"default"},"sap.m.InputBase":{hideControl:"default",unhideControl:"default"},"sap.m.InputListItem":"sap/m/flexibility/InputListItem","sap.m.Label":"sap/m/flexibility/Label","sap.m.MultiInput":{hideControl:"default",unhideControl:"default"},"sap.m.ListItemBase":{hideControl:"default",unhideControl:"default"},"sap.m.Link":"sap/m/flexibility/Link","sap.m.List":{hideControl:"default",unhideControl:"default",moveControls:"default"},"sap.m.ListBase":{hideControl:"default",unhideControl:"default",moveControls:"default"},"sap.m.MaskInput":{hideControl:"default",unhideControl:"default"},"sap.m.MenuButton":"sap/m/flexibility/MenuButton","sap.m.OverflowToolbar":"sap/m/flexibility/OverflowToolbar","sap.m.OverflowToolbarButton":"sap/m/flexibility/OverflowToolbarButton","sap.m.Page":"sap/m/flexibility/Page","sap.m.Panel":"sap/m/flexibility/Panel","sap.m.Popover":"sap/m/flexibility/Popover","sap.m.RadioButton":"sap/m/flexibility/RadioButton","sap.m.RatingIndicator":{hideControl:"default",unhideControl:"default"},"sap.m.RangeSlider":{hideControl:"default",unhideControl:"default"},"sap.m.ScrollContainer":{hideControl:"default",moveControls:"default",unhideControl:"default"},"sap.m.Slider":{hideControl:"default",unhideControl:"default"},"sap.m.StandardListItem":"sap/m/flexibility/StandardListItem","sap.m.Table":"sap/m/flexibility/Table","sap.m.Column":{hideControl:"default",unhideControl:"default"},"sap.m.Text":"sap/m/flexibility/Text","sap.m.Title":"sap/m/flexibility/Title","sap.m.Toolbar":"sap/m/flexibility/Toolbar","sap.m.VBox":{hideControl:"default",unhideControl:"default",moveControls:"default"}},"sap.ui.support":{publicRules:true,internalRules:true}}});var y=sap.m;y.BackgroundDesign={Solid:"Solid",Transparent:"Transparent",Translucent:"Translucent"};y.BadgeState={Updated:"Updated",Appear:"Appear",Disappear:"Disappear"};y.BadgeAnimationType={Full:"Full",Update:"Update",None:"None"};y.EmptyIndicatorMode={On:"On",Off:"Off",Auto:"Auto"};y.BadgeStyle={Default:"Default",Attention:"Attention"};y.BarDesign={Auto:"Auto",Header:"Header",SubHeader:"SubHeader",Footer:"Footer"};y.BreadcrumbsSeparatorStyle={Slash:"Slash",BackSlash:"BackSlash",DoubleSlash:"DoubleSlash",DoubleBackSlash:"DoubleBackSlash",GreaterThan:"GreaterThan",DoubleGreaterThan:"DoubleGreaterThan"};y.ButtonType={Default:"Default",Back:"Back",Accept:"Accept",Reject:"Reject",Transparent:"Transparent",Ghost:"Ghost",Up:"Up",Unstyled:"Unstyled",Emphasized:"Emphasized",Critical:"Critical",Negative:"Negative",Success:"Success",Neutral:"Neutral",Attention:"Attention"};y.ButtonAccessibilityType={Default:"Default",Labelled:"Labelled",Described:"Described",Combined:"Combined"};y.CarouselArrowsPlacement={Content:"Content",PageIndicator:"PageIndicator"};y.PlanningCalendarBuiltInView={Hour:"Hour",Day:"Day",Month:"Month",Week:"Week",OneMonth:"One Month"};y.DateTimeInputType={Date:"Date",DateTime:"DateTime",Time:"Time"};y.DialogType={Standard:"Standard",Message:"Message"};y.DialogRoleType={Dialog:"dialog",AlertDialog:"alertdialog"};y.DeviationIndicator={Up:"Up",Down:"Down",None:"None"};y.DraftIndicatorState={Clear:"Clear",Saving:"Saving",Saved:"Saved"};y.FacetFilterListDataType={Date:"Date",DateTime:"DateTime",Time:"Time",Integer:"Integer",Float:"Float",String:"String",Boolean:"Boolean"};y.FacetFilterType={Simple:"Simple",Light:"Light"};y.FlexAlignItems={Start:"Start",End:"End",Center:"Center",Baseline:"Baseline",Stretch:"Stretch",Inherit:"Inherit"};y.FlexAlignSelf={Auto:"Auto",Start:"Start",End:"End",Center:"Center",Baseline:"Baseline",Stretch:"Stretch",Inherit:"Inherit"};y.FlexDirection={Row:"Row",Column:"Column",RowReverse:"RowReverse",ColumnReverse:"ColumnReverse",Inherit:"Inherit"};y.FlexJustifyContent={Start:"Start",End:"End",Center:"Center",SpaceBetween:"SpaceBetween",SpaceAround:"SpaceAround",Inherit:"Inherit"};y.FlexWrap={NoWrap:"NoWrap",Wrap:"Wrap",WrapReverse:"WrapReverse"};y.FlexAlignContent={Start:"Start",End:"End",Center:"Center",SpaceBetween:"SpaceBetween",SpaceAround:"SpaceAround",Stretch:"Stretch",Inherit:"Inherit"};y.FlexRendertype={Div:"Div",List:"List",Bare:"Bare"};y.FrameType={OneByOne:"OneByOne",TwoByOne:"TwoByOne",TwoThirds:"TwoThirds",Auto:"Auto",TwoByHalf:"TwoByHalf",OneByHalf:"OneByHalf"};y.LinkConversion={None:"None",ProtocolOnly:"ProtocolOnly",All:"All"};y.InputTextFormatMode={Value:"Value",Key:"Key",ValueKey:"ValueKey",KeyValue:"KeyValue"};y.GenericTagDesign={Full:"Full",StatusIconHidden:"StatusIconHidden"};y.GenericTagValueState={None:"None",Error:"Error"};y.GenericTileMode={ContentMode:"ContentMode",HeaderMode:"HeaderMode",LineMode:"LineMode"};y.GenericTileScope={Display:"Display",Actions:"Actions",ActionMore:"ActionMore",ActionRemove:"ActionRemove"};y.TabsOverflowMode={End:"End",StartAndEnd:"StartAndEnd"};y.TileSizeBehavior={Responsive:"Responsive",Small:"Small"};y.HeaderLevel={H1:"H1",H2:"H2",H3:"H3",H4:"H4",H5:"H5",H6:"H6"};y.IBarHTMLTag={Div:"Div",Header:"Header",Footer:"Footer"};y.IconTabHeaderMode={Standard:"Standard",Inline:"Inline"};y.IconTabDensityMode={Inherit:"Inherit",Compact:"Compact",Cozy:"Cozy"};y.IconTabFilterDesign={Horizontal:"Horizontal",Vertical:"Vertical"};y.ImageMode={Image:"Image",Background:"Background"};y.Size={XS:"XS",S:"S",M:"M",L:"L",Auto:"Auto",Responsive:"Responsive"};y.ValueColor={Neutral:"Neutral",Good:"Good",Critical:"Critical",Error:"Error",None:"None"};y.ValueCSSColor=t.createType("sap.m.ValueCSSColor",{isValid:function(e){var t=y.ValueColor.hasOwnProperty(e);if(t){return t}else{t=r.CSSColor.isValid(e);if(t){return t}else{var a=sap.ui.requireSync("sap/ui/core/theming/Parameters");return r.CSSColor.isValid(a.get(e))}}}},t.getType("string"));y.SelectColumnRatio=t.createType("sap.m.SelectColumnRatio",{isValid:function(e){return/^([0-9]+:[0-9]+)$/.test(e)}},t.getType("string"));y.InputType={Text:"Text",Date:"Date",Datetime:"Datetime",DatetimeLocale:"DatetimeLocale",Email:"Email",Month:"Month",Number:"Number",Tel:"Tel",Time:"Time",Url:"Url",Week:"Week",Password:"Password"};y.LabelDesign={Bold:"Bold",Standard:"Standard"};y.ListHeaderDesign={Standard:"Standard",Plain:"Plain"};y.ListMode={None:"None",SingleSelect:"SingleSelect",SingleSelectLeft:"SingleSelectLeft",SingleSelectMaster:"SingleSelectMaster",MultiSelect:"MultiSelect",Delete:"Delete"};y.ListKeyboardMode={Navigation:"Navigation",Edit:"Edit"};y.ListGrowingDirection={Downwards:"Downwards",Upwards:"Upwards"};y.ListSeparators={All:"All",Inner:"Inner",None:"None"};y.ListType={Inactive:"Inactive",Detail:"Detail",Navigation:"Navigation",Active:"Active",DetailAndActive:"DetailAndActive"};y.SelectListKeyboardNavigationMode={None:"None",Delimited:"Delimited"};y.LoadState={Loading:"Loading",Loaded:"Loaded",Failed:"Failed",Disabled:"Disabled"};y.MenuButtonMode={Regular:"Regular",Split:"Split"};y.OverflowToolbarPriority={NeverOverflow:"NeverOverflow",Never:"Never",High:"High",Low:"Low",Disappear:"Disappear",AlwaysOverflow:"AlwaysOverflow",Always:"Always"};y.ObjectHeaderPictureShape={Circle:"Circle",Square:"Square"};y.P13nPanelType={sort:"sort",filter:"filter",group:"group",columns:"columns",dimeasure:"dimeasure",selection:"selection"};y.P13nConditionOperation={BT:"BT",EQ:"EQ",Contains:"Contains",StartsWith:"StartsWith",EndsWith:"EndsWith",LT:"LT",LE:"LE",GT:"GT",GE:"GE",Initial:"Initial",Empty:"Empty",NotBT:"NotBT",NotEQ:"NotEQ",NotContains:"NotContains",NotStartsWith:"NotStartsWith",NotEndsWith:"NotEndsWith",NotLT:"NotLT",NotLE:"NotLE",NotGT:"NotGT",NotGE:"NotGE",NotInitial:"NotInitial",NotEmpty:"NotEmpty",Ascending:"Ascending",Descending:"Descending",GroupAscending:"GroupAscending",GroupDescending:"GroupDescending",Total:"Total",Average:"Average",Minimum:"Minimum",Maximum:"Maximum"};y.P13nConditionOperationType={Include:"Include",Exclude:"Exclude"};y.PageBackgroundDesign={Standard:"Standard",List:"List",Solid:"Solid",Transparent:"Transparent"};y.PanelAccessibleRole={Complementary:"Complementary",Form:"Form",Region:"Region"};y.PDFViewerDisplayType={Auto:"Auto",Embedded:"Embedded",Link:"Link"};y.PlacementType={Left:"Left",Right:"Right",Top:"Top",Bottom:"Bottom",Vertical:"Vertical",VerticalPreferedTop:"VerticalPreferedTop",VerticalPreferredTop:"VerticalPreferredTop",VerticalPreferedBottom:"VerticalPreferedBottom",VerticalPreferredBottom:"VerticalPreferredBottom",Horizontal:"Horizontal",HorizontalPreferedRight:"HorizontalPreferedRight",HorizontalPreferredRight:"HorizontalPreferredRight",HorizontalPreferedLeft:"HorizontalPreferedLeft",HorizontalPreferredLeft:"HorizontalPreferredLeft",PreferredLeftOrFlip:"PreferredLeftOrFlip",PreferredRightOrFlip:"PreferredRightOrFlip",PreferredTopOrFlip:"PreferredTopOrFlip",PreferredBottomOrFlip:"PreferredBottomOrFlip",Auto:"Auto"};y.QuickViewGroupElementType={phone:"phone",mobile:"mobile",email:"email",link:"link",text:"text",pageLink:"pageLink"};y.VerticalPlacementType={Top:"Top",Bottom:"Bottom",Vertical:"Vertical"};y.PopinDisplay={Block:"Block",Inline:"Inline",WithoutHeader:"WithoutHeader"};y.PopinLayout={Block:"Block",GridSmall:"GridSmall",GridLarge:"GridLarge"};y.Sticky={ColumnHeaders:"ColumnHeaders",HeaderToolbar:"HeaderToolbar",InfoToolbar:"InfoToolbar"};y.RatingIndicatorVisualMode={Full:"Full",Half:"Half"};y.ScreenSize={Phone:"Phone",Tablet:"Tablet",Desktop:"Desktop",XXSmall:"XXSmall",XSmall:"XSmall",Small:"Small",Medium:"Medium",Large:"Large",XLarge:"XLarge",XXLarge:"XXLarge"};y.SelectionDetailsActionLevel={Item:"Item",List:"List",Group:"Group"};y.SelectType={Default:"Default",IconOnly:"IconOnly"};y.SplitAppMode={ShowHideMode:"ShowHideMode",StretchCompressMode:"StretchCompressMode",PopoverMode:"PopoverMode",HideMode:"HideMode"};y.StandardTileType={Create:"Create",Monitor:"Monitor",None:"None"};y.semantic=y.semantic||{};y.semantic.SemanticRuleSetType={Classic:"Classic",Optimized:"Optimized"};y.ObjectMarkerType={Flagged:"Flagged",Favorite:"Favorite",Draft:"Draft",Locked:"Locked",Unsaved:"Unsaved",LockedBy:"LockedBy",UnsavedBy:"UnsavedBy"};y.ObjectMarkerVisibility={IconOnly:"IconOnly",TextOnly:"TextOnly",IconAndText:"IconAndText"};y.SwipeDirection={LeftToRight:"LeftToRight",RightToLeft:"RightToLeft",BeginToEnd:"BeginToEnd",EndToBegin:"EndToBegin",Both:"Both"};y.SwitchType={Default:"Default",AcceptReject:"AcceptReject"};y.TokenizerRenderMode={Loose:"Loose",Narrow:"Narrow"};y.ToolbarDesign={Auto:"Auto",Transparent:"Transparent",Info:"Info",Solid:"Solid"};y.ToolbarStyle={Standard:"Standard",Clear:"Clear"};y.TimePickerMaskMode={On:"On",Off:"Off"};y.StringFilterOperator={Equals:"Equals",Contains:"Contains",StartsWith:"StartsWith",AnyWordStartsWith:"AnyWordStartsWith"};y.LightBoxLoadingStates={Loading:"LOADING",Loaded:"LOADED",TimeOutError:"TIME_OUT_ERROR",Error:"ERROR"};y.StepInputValidationMode={FocusOut:"FocusOut",LiveChange:"LiveChange"};y.StepInputStepModeType={AdditionAndSubtraction:"AdditionAndSubtraction",Multiple:"Multiple"};y.UploadState={Complete:"Complete",Error:"Error",Ready:"Ready",Uploading:"Uploading"};y.WrappingType={Normal:"Normal",Hyphenated:"Hyphenated"};y.PlanningCalendarStickyMode={None:"None",All:"All",NavBarAndColHeaders:"NavBarAndColHeaders"};y.TitleAlignment={None:"None",Auto:"Auto",Start:"Start",Center:"Center"};y.ExpandableTextOverflowMode={InPlace:"InPlace",Popover:"Popover"};y.AvatarShape=d;y.AvatarSize=g;y.AvatarType=f;y.AvatarColor=S;y.AvatarImageFitType=T;y.WizardRenderMode={Scroll:"Scroll",Page:"Page"};y.ResetAllMode={Default:"Default",ServiceDefault:"ServiceDefault",ServiceReset:"ServiceReset"};sap.ui.lazyRequire("sap.m.MessageToast","show");sap.ui.lazyRequire("sap.m.routing.RouteMatchedHandler");sap.ui.lazyRequire("sap.m.routing.Router");sap.ui.lazyRequire("sap.m.routing.Target");sap.ui.lazyRequire("sap.m.routing.TargetHandler");sap.ui.lazyRequire("sap.m.routing.Targets");if(e.os.ios&&e.os.version>=7&&e.os.version<8&&e.browser.name==="sf"){sap.ui.requireSync("sap/m/ios7")}if(/sap-ui-xx-formfactor=compact/.test(location.search)){l("html").addClass("sapUiSizeCompact");y._bSizeCompact=true}if(/sap-ui-xx-formfactor=condensed/.test(location.search)){l("html").addClass("sapUiSizeCondensed");y._bSizeCondensed=true}y.getInvalidDate=function(){return null};y.getLocale=function(){var e=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();y.getLocale=function(){return e};return e};y.getLocaleData=function(){var e=sap.ui.requireSync("sap/ui/core/LocaleData").getInstance(y.getLocale());y.getLocaleData=function(){return e};return e};y.isDate=function(e){return e&&Object.prototype.toString.call(e)=="[object Date]"&&!isNaN(e)};y.getIScroll=function(e){if(typeof window.iScroll!="function"||!(e instanceof n)){return}var t,a;for(t=e;t=t.oParent;){a=t.getScrollDelegate?t.getScrollDelegate()._scroller:null;if(a&&a instanceof window.iScroll){return a}}};y.getScrollDelegate=function(e,t){if(!(e instanceof n)){return}var a=sap.ui.require("sap/ui/core/UIComponent");function i(e){if(!e){return}return t&&a&&e instanceof a?e.oContainer:e.oParent}for(var o=e;o=i(o);){if(o&&typeof o.getScrollDelegate=="function"){return o.getScrollDelegate(e)}}};y.ScreenSizes={phone:240,tablet:600,desktop:1024,xxsmall:240,xsmall:320,small:480,medium:560,large:768,xlarge:960,xxlarge:1120};u(y,"BaseFontSize",function(){y.BaseFontSize=l(document.documentElement).css("font-size")||"16px";return y.BaseFontSize});y.closeKeyboard=function(){var t=document.activeElement;if(!e.system.desktop&&t&&/(INPUT|TEXTAREA)/i.test(t.tagName)){t.blur()}};y.touch=y.touch||{};y.touch.find=function(e,t){var a,n;if(!e){return}if(t&&typeof t.identifier!=="undefined"){t=t.identifier}else if(typeof t!=="number"){p(false,"sap.m.touch.find(): oTouch must be a touch object or a number");return}n=e.length;for(a=0;a<n;a++){if(e[a].identifier===t){return e[a]}}};y.touch.countContained=function(e,t){var a,n=0,i,o,r;if(!e){return 0}if(t instanceof Element){t=l(t)}else if(typeof t==="string"){t=l(document.getElementById(t))}else if(!(t instanceof l)){p(false,"sap.m.touch.countContained(): vElement must be a jQuery object or Element reference or a string");return 0}o=t.children().length;i=e.length;for(a=0;a<i;a++){r=l(e[a].target);if(o===0&&r.is(t)||t[0].contains(r[0])){n++}}return n};y.URLHelper=function(){function e(e){return e&&Object.prototype.toString.call(e)=="[object String]"}function t(t){if(!e(t)){return""}return t.replace(/[^0-9\+\*#]/g,"")}function n(t){if(!e(t)){return""}t=t.split(/\r\n|\r|\n/g).join("\r\n");return encodeURIComponent(t)}return l.extend(new a,{normalizeTel:function(e){return"tel:"+t(e)},normalizeSms:function(e){return"sms:"+t(e)},normalizeEmail:function(t,a,i,o,r){var s=[],l="mailto:",p=encodeURIComponent;e(t)&&(l+=p(t.trim()));e(a)&&s.push("subject="+p(a));e(i)&&s.push("body="+n(i));e(r)&&s.push("bcc="+p(r.trim()));e(o)&&s.push("cc="+p(o.trim()));if(s.length){l+="?"+s.join("&")}return l},redirect:function(t,a){p(e(t),this+"#redirect: URL must be a string");this.fireEvent("redirect",t);if(!a){window.location.href=t}else{o(t,"_blank")}},attachRedirect:function(e,t){return this.attachEvent("redirect",e,t)},detachRedirect:function(e,t){return this.detachEvent("redirect",e,t)},triggerTel:function(e){this.redirect(this.normalizeTel(e))},triggerSms:function(e){this.redirect(this.normalizeSms(e))},triggerEmail:function(e,t,a,n,i,o){var o=o||false;this.redirect(this.normalizeEmail.apply(0,[e,t,a,n,i]),o)},toString:function(){return"sap.m.URLHelper"}})}();y.BackgroundHelper={addBackgroundColorStyles:function(e,a,n,i){e.class(i||"sapUiGlobalBackgroundColor");if(a&&!t.getType("sap.ui.core.CSSColor").isValid(a)){m.warning(a+" is not a valid sap.ui.core.CSSColor type");a=""}if(a||n){e.style("background-image","none");e.style("filter","none")}if(a){e.style("background-color",a)}},renderBackgroundImageTag:function(e,t,a,n,i,o){e.openStart("div",t.getId()+"-BG");if(Array.isArray(a)){for(var r=0;r<a.length;r++){e.class(a[r])}}else{e.class(a)}e.class("sapUiGlobalBackgroundImage");if(n){e.style("display","block");e.style("background-image","url("+c(n)+")");e.style("background-repeat",i?"repeat":"no-repeat");if(!i){e.style("background-size","cover");e.style("background-position","center")}else{e.style("background-position","left top")}}if(o!==1){if(o>1){o=1}e.style("opacity",o)}e.openEnd();e.close("div")}};y.ImageHelper=function(){function e(e,t,a){if(a!==undefined){var n=e["set"+s(t)];if(typeof n==="function"){n.call(e,a);return true}}return false}var t={getImageControl:function(t,a,n,i,o,r){p(i.src,"sap.m.ImageHelper.getImageControl: mProperties do not contain 'src'");if(a&&a.getSrc()!=i.src){a.destroy();a=undefined}if(a&&(a instanceof sap.m.Image||a instanceof sap.ui.core.Icon)){for(var s in i){e(a,s,i[s])}}else{var l=sap.ui.require("sap/m/Image")||sap.ui.requireSync("sap/m/Image");var m=Object.assign({},i,{id:t});a=sap.ui.core.IconPool.createControlByURI(m,l);a.setParent(n,null,true)}if(r){for(var u=0,c=r.length;u!==c;u++){a.removeStyleClass(r[u])}}if(o){for(var d=0,g=o.length;d!==g;d++){a.addStyleClass(o[d])}}return a}};return t}();y.PopupHelper={calcPercentageSize:function(e,t){if(typeof e!=="string"){m.warning("sap.m.PopupHelper: calcPercentageSize, the first parameter"+e+"isn't with type string");return null}if(e.indexOf("%")<=0){m.warning("sap.m.PopupHelper: calcPercentageSize, the first parameter"+e+"is not a percentage string (for example '25%')");return null}var a=parseFloat(e)/100,n=parseFloat(t);return Math.floor(a*n)+"px"}};y.InputODataSuggestProvider=function(){var e=function(e){var t=e.getSource();var a=t.data(t.getId()+"-#valueListAnnotation");var n=t.getModel();var i=t.getBinding("value");var o=n.resolve(i.getPath(),i.getContext());if(!a){return}var r=e.getParameter("selectedRow");l.each(r.getCells(),function(e,t){var r=t.getBinding("text");l.each(a.outParameters,function(e,t){if(!t.displayOnly&&t.value==r.getPath()){var a=r.getValue();var s=n.resolve(e,i.getContext());if(a&&s!==o){n.setProperty(s,a)}}})});return true};var t=function(t,a){var n=t.getModel();var i=n.oMetadata;var o=n.resolve(t.getBindingPath("value"),t.getBindingContext());var r={};r.searchSupported=false;r.collectionPath="";r.outParameters={};r.inParameters={};r.selection=[];var s=n.getProperty(o+"/#com.sap.vocabularies.Common.v1.ValueList");if(!s){return false}var p=o.substr(o.lastIndexOf("/")+1);r.inProperty=p;l.each(s.record,function(e,t){l.each(t,function(e,t){if(t.property==="SearchSupported"&&t.bool){r.searchSupported=true}if(t.property==="CollectionPath"){r.collectionPath=t.string}if(t.property==="Parameters"){l.each(t.collection.record,function(e,t){if(t.type==="com.sap.vocabularies.Common.v1.ValueListParameterIn"){var a;l.each(t.propertyValue,function(e,t){if(t.property==="LocalDataProperty"){a=t.propertyPath}});l.each(t.propertyValue,function(e,t){if(t.property==="ValueListProperty"){r.inParameters[a]={value:t.string}}})}else if(t.type==="com.sap.vocabularies.Common.v1.ValueListParameterInOut"){var a;l.each(t.propertyValue,function(e,t){if(t.property==="LocalDataProperty"){a=t.propertyPath}});l.each(t.propertyValue,function(e,t){if(t.property==="ValueListProperty"){r.outParameters[a]={value:t.string};r.inParameters[a]={value:t.string}}})}else if(t.type==="com.sap.vocabularies.Common.v1.ValueListParameterOut"){var a;l.each(t.propertyValue,function(e,t){if(t.property==="LocalDataProperty"){a=t.propertyPath}});l.each(t.propertyValue,function(e,t){if(t.property==="ValueListProperty"){r.outParameters[a]={value:t.string}}})}else if(t.type==="com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"){var a;l.each(t.propertyValue,function(e,t){if(t.property==="ValueListProperty"){r.outParameters[t.string]={value:t.string,displayOnly:true}}})}})}})});r.resultEntity=i._getEntityTypeByPath("/"+r.collectionPath);r.listItem=new sap.m.ColumnListItem;l.each(r.outParameters,function(e,a){r.listItem.addCell(new sap.m.Text({text:"{"+a.value+"}",wrapping:false}));t.addSuggestionColumn(new sap.m.Column({header:new sap.m.Text({text:"{/#"+r.resultEntity.name+"/"+a.value+"/@sap:label}",wrapping:false})}));r.selection.push(a.value)});t.data(t.getId()+"-#valueListAnnotation",r);if(a){t.attachSuggestionItemSelected(e)}};var a={suggest:function(e,a,n,i){var o,r=e.getSource();a=a===undefined?true:a;n=n===undefined?true:n;if(!r.data(r.getId()+"-#valueListAnnotation")){t(r,n)}o=r.data(r.getId()+"-#valueListAnnotation");if(!o){return}var s=function(e){var t=this.getLength();if(t&&t<=i){r.setShowTableSuggestionValueHelp(false)}else{r.setShowTableSuggestionValueHelp(true)}};if(o.searchSupported){var m=[];var u,c={};if(a){l.each(o.inParameters,function(e,t){if(e==o.inProperty){u=t.value}else if(a){var n=r.getModel().getProperty(e,r.getBinding("value").getContext());if(n){m.push(new sap.ui.model.Filter(t.value,sap.ui.model.FilterOperator.StartsWith,n))}}})}c.search=e.getParameter("suggestValue");if(o.inParameters.length){if(u){c["search-focus"]=u}else{p(false,"no search-focus defined")}}r.bindAggregation("suggestionRows",{path:"/"+o.collectionPath,length:i,filters:m,parameters:{select:o.selection.join(","),custom:c},events:{dataReceived:s},template:o.listItem})}else{var m=[];l.each(o.inParameters,function(t,n){if(t==o.inProperty){m.push(new sap.ui.model.Filter(n.value,sap.ui.model.FilterOperator.StartsWith,e.getParameter("suggestValue")))}else if(a){var i=r.getModel().getProperty(t,r.getBinding("value").getContext());if(i){m.push(new sap.ui.model.Filter(n.value,sap.ui.model.FilterOperator.StartsWith,i))}}});r.bindAggregation("suggestionRows",{path:"/"+o.collectionPath,filters:m,template:o.listItem,length:i,parameters:{select:o.selection.join(",")},events:{dataReceived:s}})}}};return a}();i.set("sap.ui.layout.form.FormHelper",{createLabel:function(e,t){return new sap.m.Label(t,{text:e})},createButton:function(e,t,a){var n=this;var i=function(i){var o=new i(e,{type:y.ButtonType.Transparent});o.attachEvent("press",t,n);a.call(n,o)};var o=sap.ui.require("sap/m/Button");if(o){i(o)}else{sap.ui.require(["sap/m/Button"],i)}},setButtonContent:function(e,t,a,n,i){e.setText(t);e.setTooltip(a);e.setIcon(n);e.setActiveIcon(i)},addFormClass:function(){return"sapUiFormM"},setToolbar:function(e){var t=this.getToolbar();if(t&&t.setDesign){t.setDesign(t.getDesign(),true)}if(e&&e.setDesign){e.setDesign(sap.m.ToolbarDesign.Transparent,true)}return e},getToolbarTitle:function(e){if(e){var t=e.getContent();for(var a=0;a<t.length;a++){var n=t[a];if(n.isA("sap.m.Title")){return n.getId()}}return e.getId()}},createDelimiter:function(e,t){return new sap.m.Text(t,{text:e,textAlign:r.TextAlign.Center})},createSemanticDisplayControl:function(e,t){return new sap.m.Text(t,{text:e})},updateDelimiter:function(e,t){e.setText(t)},updateSemanticDisplayControl:function(e,t){e.setText(t)},bArrowKeySupport:false,bFinal:true});i.set("sap.ui.unified.FileUploaderHelper",{createTextField:function(e){var t=new sap.m.Input(e);return t},setTextFieldContent:function(e,t){e.setWidth(t)},createButton:function(e){var t=new sap.m.Button(e);return t},addFormClass:function(){return"sapUiFUM"},bFinal:true});i.set("sap.ui.unified.ColorPickerHelper",{isResponsive:function(){return true},factory:{createLabel:function(e){return new sap.m.Label(e)},createInput:function(e,t){return new sap.m.InputBase(e,t)},createSlider:function(e,t){return new sap.m.Slider(e,t)},createRadioButtonGroup:function(e){return new sap.m.RadioButtonGroup(e)},createRadioButtonItem:function(e){return new sap.m.RadioButton(e)},createButton:function(e,t){return new sap.m.Button(e,t)}},bFinal:true});i.set("sap.ui.table.TableHelper",{createLabel:function(e){return new sap.m.Label(e)},createTextView:function(e){return new sap.m.Label(e)},addTableClass:function(){return"sapUiTableM"},bFinal:true});i.set("sap.ui.layout.GridHelper",{getLibrarySpecificClass:function(){return""},bFinal:true});if(e.os.blackberry||e.os.android&&e.os.version>=4){l(window).on("resize",function(){var e=document.activeElement;var t=e?e.tagName:"";if(t=="INPUT"||t=="TEXTAREA"){setTimeout(function(){e.scrollIntoViewIfNeeded()},0)}})}if(!Number.MAX_SAFE_INTEGER){Number.MAX_SAFE_INTEGER=Math.pow(2,53)-1}return y});