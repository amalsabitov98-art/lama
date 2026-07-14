"""Voice Studio — консистентная озвучка видео одним AI-голосом.

Два режима:
  * talking_head — говорящий человек в кадре (озвучка + липсинк)
  * voiceover    — закадровый голос поверх нарезок (только озвучка)

Голоса хранятся как пресеты в библиотеке (data/voices), поэтому один и тот же
тембр можно переиспользовать между роликами и режимами.
"""

from .voices import VoiceLibrary, Voice
from .pipeline import Pipeline, Mode

__all__ = ["VoiceLibrary", "Voice", "Pipeline", "Mode"]
__version__ = "0.1.0"
